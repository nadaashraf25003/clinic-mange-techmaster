using BuildingBlocks.Domain;
using FluentValidation;
using MediatR;

namespace BuildingBlocks.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationFailures = await Task.WhenAll(
            validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationFailures
            .SelectMany(result => result.Errors)
            .Where(failure => failure != null)
            .ToList();

        if (failures.Count != 0)
        {
            var firstFailure = failures[0];
            var error = Error.Validation(firstFailure.PropertyName, firstFailure.ErrorMessage);

            if (typeof(TResponse) == typeof(Result))
            {
                return (TResponse)(object)Result.Failure(error);
            }

            var genericType = typeof(TResponse).GetGenericArguments().FirstOrDefault();
            if (genericType != null)
            {
                var failureMethod = typeof(Result)
                    .GetMethods()
                    .First(m => m.Name == nameof(Result.Failure) && m.IsGenericMethod)
                    .MakeGenericMethod(genericType);

                return (TResponse)failureMethod.Invoke(null, [error])!;
            }
        }

        return await next();
    }
}
