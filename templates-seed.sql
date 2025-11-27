-- Templates predefinidos para Angular Form Builder
-- Ejecutar este script en Supabase SQL Editor después de crear la tabla templates

-- Template 1: Contact Form
INSERT INTO templates (name, description, category, schema_json, is_featured) VALUES (
  'Contact Form',
  'Simple contact form with name, email, and message fields',
  'contact',
  '{
    "fields": [
      {
        "name": "fullName",
        "type": "string",
        "required": true,
        "label": "Full Name",
        "placeholder": "John Doe"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "label": "Email Address",
        "placeholder": "john@example.com"
      },
      {
        "name": "message",
        "type": "string",
        "required": true,
        "label": "Message",
        "placeholder": "Your message here..."
      }
    ]
  }'::jsonb,
  true
);

-- Template 2: User Registration
INSERT INTO templates (name, description, category, schema_json, is_featured) VALUES (
  'User Registration',
  'Complete user registration form',
  'registration',
  '{
    "fields": [
      {
        "name": "username",
        "type": "string",
        "required": true,
        "label": "Username",
        "placeholder": "Choose a username"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "label": "Email",
        "placeholder": "your@email.com"
      },
      {
        "name": "password",
        "type": "string",
        "required": true,
        "label": "Password",
        "placeholder": "Min 8 characters"
      },
      {
        "name": "age",
        "type": "number",
        "required": false,
        "label": "Age",
        "placeholder": "18"
      },
      {
        "name": "acceptTerms",
        "type": "boolean",
        "required": true,
        "label": "I accept the terms and conditions"
      }
    ]
  }'::jsonb,
  true
);

-- Template 3: Payment Form
INSERT INTO templates (name, description, category, schema_json, is_featured) VALUES (
  'Payment Information',
  'Credit card payment form',
  'payment',
  '{
    "fields": [
      {
        "name": "cardholderName",
        "type": "string",
        "required": true,
        "label": "Cardholder Name",
        "placeholder": "Name on card"
      },
      {
        "name": "cardNumber",
        "type": "string",
        "required": true,
        "label": "Card Number",
        "placeholder": "1234 5678 9012 3456"
      },
      {
        "name": "expiryDate",
        "type": "string",
        "required": true,
        "label": "Expiry Date",
        "placeholder": "MM/YY"
      },
      {
        "name": "cvv",
        "type": "string",
        "required": true,
        "label": "CVV",
        "placeholder": "123"
      },
      {
        "name": "saveCard",
        "type": "boolean",
        "required": false,
        "label": "Save card for future payments"
      }
    ]
  }'::jsonb,
  false
);

-- Template 4: Company Information
INSERT INTO templates (name, description, category, schema_json, is_featured) VALUES (
  'Company Information',
  'Business profile form',
  'business',
  '{
    "fields": [
      {
        "name": "companyName",
        "type": "string",
        "required": true,
        "label": "Company Name",
        "placeholder": "Acme Inc."
      },
      {
        "name": "industry",
        "type": "string",
        "required": true,
        "label": "Industry",
        "placeholder": "Technology"
      },
      {
        "name": "employees",
        "type": "number",
        "required": false,
        "label": "Number of Employees",
        "placeholder": "50"
      },
      {
        "name": "revenue",
        "type": "number",
        "required": false,
        "label": "Annual Revenue (USD)",
        "placeholder": "1000000"
      },
      {
        "name": "isPublic",
        "type": "boolean",
        "required": false,
        "label": "Publicly Traded Company"
      }
    ]
  }'::jsonb,
  false
);

-- Template 5: Feedback Survey
INSERT INTO templates (name, description, category, schema_json, is_featured) VALUES (
  'Customer Feedback',
  'Simple customer satisfaction survey',
  'survey',
  '{
    "fields": [
      {
        "name": "customerName",
        "type": "string",
        "required": false,
        "label": "Your Name (Optional)",
        "placeholder": "Anonymous"
      },
      {
        "name": "email",
        "type": "string",
        "required": false,
        "label": "Email (Optional)",
        "placeholder": "your@email.com"
      },
      {
        "name": "rating",
        "type": "number",
        "required": true,
        "label": "Overall Satisfaction (1-10)",
        "placeholder": "8"
      },
      {
        "name": "wouldRecommend",
        "type": "boolean",
        "required": true,
        "label": "Would you recommend us?"
      },
      {
        "name": "comments",
        "type": "string",
        "required": false,
        "label": "Additional Comments",
        "placeholder": "Tell us more..."
      }
    ]
  }'::jsonb,
  true
);
