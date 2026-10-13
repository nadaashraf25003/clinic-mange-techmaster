using BuildingBlocks.Domain;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildingBlocks.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        logger.LogInformation("Handling request {RequestName}", requestName);

        var response = await next();

        if (response.IsFailure)
        {
            logger.LogWarning(
                "Request {RequestName} failed with error: {ErrorCode} - {ErrorDescription}",
                requestName,
                response.Error.Code,
                response.Error.Description);
        }
        else
        {
            logger.LogInformation("Request {RequestName} processed successfully", requestName);
        }

        return response;
    }
}
