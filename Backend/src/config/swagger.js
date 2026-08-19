import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "LeadFlow AI API Documentation",
    version: "1.0.0",
    description: "Production-ready OpenAPI specs for LeadFlow AI SaaS CRM Platform"
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local Development Server"
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "leadflow_token"
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "API Health Check",
        responses: {
          200: { description: "API is healthy" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register new organization & admin user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  organizationName: { type: "string", example: "Acme Corp" },
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@acme.com" },
                  password: { type: "string", example: "secret123" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "User registered" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "john@acme.com" },
                  password: { type: "string", example: "secret123" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Login successful" } }
      }
    },
    "/leads": {
      get: {
        summary: "Get organization leads with pagination and search",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 200: { description: "List of leads" } }
      },
      post: {
        summary: "Create a new lead",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 201: { description: "Lead created" } }
      }
    },
    "/dashboard/summary": {
      get: {
        summary: "Get dashboard analytical metrics",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 200: { description: "Metrics summary" } }
      }
    },
    "/leads/{id}/analyze": {
      post: {
        summary: "AI Lead Scoring & Analysis",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 200: { description: "AI analysis result" } }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
