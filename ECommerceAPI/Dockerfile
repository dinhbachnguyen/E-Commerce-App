# Stage 1 - Build using SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore
COPY *.csproj ./
RUN dotnet restore

# Copy all source code and publish
COPY . ./
RUN dotnet publish -c Release -o /app

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published DLL from build stage
COPY --from=build /app .

# Expose backend port
EXPOSE 5000

# Run the backend app
ENTRYPOINT ["dotnet", "ECommerceAPI.dll"]
