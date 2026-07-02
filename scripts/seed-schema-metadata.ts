import { db } from "../db/db";
import { schemaMetadataTable } from "../db/schema";

const tableMetadata = [
  {
    table_name: "companies",
    description: "Company information for all organizations in the database. Contains company name, industry sector, and country of operation. This is the root table — many other tables reference companies via company_id.",
    columns: "id, name, industry, country, created_at",
    column_types: "id: integer (primary key, auto-increment), name: text (not null), industry: text, country: text, created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "employees.company_id → companies.id, customers.company_id → companies.id, products.company_id → companies.id, orders.company_id → companies.id, campaigns.company_id → companies.id, departments.company_id → companies.id, purchase_orders.company_id → companies.id",
    example_queries: "count companies, list all companies, companies by country, companies in specific industry, how many companies from Nepal",
  },
  {
    table_name: "employees",
    description: "Staff records with name, email, department, and job role. Each employee belongs to one organization.",
    columns: "id, company_id, name, email, department, role, created_at",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), name: text (not null), email: text (not null), department: text, role: text, created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "company_id → companies.id, departments.head_employee_id → employees.id, regions.manager_employee_id → employees.id",
    example_queries: "list employees, employees by department, employees in specific organization, count employees, who is the department head",
  },
  {
    table_name: "customers",
    description: "Customer profiles with contact information, location, signup date, and account status. Tracks total amount spent by each customer.",
    columns: "id, company_id, first_name, last_name, email, city, state, country, signup_date, status, total_spent, created_at",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), first_name: text, last_name: text, email: text, city: text, state: text, country: text, signup_date: text, status: text (values: active, inactive, churned), total_spent: real (default 0), created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "company_id → companies.id, orders.customer_id → customers.id, subscriptions.customer_id → customers.id, support_tickets.customer_id → customers.id, invoices.customer_id → customers.id, reviews.customer_id → customers.id, loyalty_points.customer_id → customers.id, shipping_addresses.customer_id → customers.id",
    example_queries: "list customers, customers by country, active customers, total spending by customer, top customers by revenue, customers from specific city",
  },
  {
    table_name: "products",
    description: "Product catalog with names, categories, pricing, and stock levels.",
    columns: "id, company_id, name, category, price, stock, is_active, created_at",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), name: text (not null), category: text, price: real (not null), stock: integer (default 0), is_active: integer (0 or 1, default 1), created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "company_id → companies.id, order_items.product_id → products.id, inventory.product_id → products.id, reviews.product_id → products.id",
    example_queries: "list products, products by category, expensive products, low stock products, active vs inactive products",
  },
  {
    table_name: "orders",
    description: "Customer orders with status, payment status, and total amount.",
    columns: "id, company_id, customer_id, order_status, payment_status, total_amount, order_date",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), customer_id: integer (foreign key → customers.id), order_status: text (values: completed, pending, refunded), payment_status: text (values: paid, pending, authorized, refunded), total_amount: real (not null), order_date: text (default CURRENT_TIMESTAMP)",
    relationships: "company_id → companies.id, customer_id → customers.id, order_items.order_id → orders.id, refunds.order_id → orders.id, shipments.order_id → orders.id",
    example_queries: "list orders, completed orders, pending orders, total revenue, orders by date range, average order amount",
  },
  {
    table_name: "order_items",
    description: "Line items within each order. Links orders to products with quantity and pricing information.",
    columns: "id, order_id, product_id, quantity, unit_price, total_price",
    column_types: "id: integer (primary key, auto-increment), order_id: integer (foreign key → orders.id), product_id: integer (foreign key → products.id), quantity: integer (not null), unit_price: real (not null), total_price: real (not null)",
    relationships: "order_id → orders.id, product_id → products.id",
    example_queries: "items in specific order, most sold products, total quantity sold, revenue by product, best selling products",
  },
  {
    table_name: "subscriptions",
    description: "Customer subscription plans with pricing, status, and renewal dates. Tracks active, canceled, and trial subscriptions.",
    columns: "id, customer_id, plan_name, monthly_price, status, start_date, end_date, renewal_date",
    column_types: "id: integer (primary key, auto-increment), customer_id: integer (foreign key → customers.id), plan_name: text, monthly_price: real, status: text (values: active, canceled, trial), start_date: text, end_date: text (nullable), renewal_date: text (nullable)",
    relationships: "customer_id → customers.id",
    example_queries: "active subscriptions, subscriptions by plan, canceled subscriptions, total monthly recurring revenue, trial conversions, subscription status breakdown",
  },
  {
    table_name: "support_tickets",
    description: "Customer support tickets with subject, status, and priority level. Tracks open and closed issues.",
    columns: "id, customer_id, subject, status, priority, created_at",
    column_types: "id: integer (priority key, auto-increment), customer_id: integer (foreign key → customers.id), subject: text, status: text (values: open, closed), priority: text (values: low, medium, high), created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "customer_id → customers.id",
    example_queries: "open tickets, high priority tickets, tickets by customer, closed tickets, average ticket count per customer",
  },
  {
    table_name: "campaigns",
    description: "Marketing campaigns with platform, budget, clicks, and conversions.",
    columns: "id, company_id, name, platform, budget, clicks, conversions, start_date, end_date",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), name: text, platform: text (values: google, meta, linkedin, twitter), budget: real, clicks: integer, conversions: integer, start_date: text, end_date: text",
    relationships: "company_id → companies.id",
    example_queries: "campaigns by platform, total ad spend, campaign ROI, best performing campaigns",
  },
  {
    table_name: "invoices",
    description: "Billing invoices issued to customers. Contains invoice number, amount, tax, and payment status.",
    columns: "id, customer_id, invoice_number, amount, tax, status, due_date, created_at",
    column_types: "id: integer (primary key, auto-increment), customer_id: integer (foreign key → customers.id), invoice_number: text (not null), amount: real (not null), tax: real (default 0), status: text (values: paid, pending, overdue), due_date: text, created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "customer_id → customers.id, payments.invoice_id → invoices.id",
    example_queries: "paid invoices, overdue invoices, total invoiced amount, invoices by customer, pending invoices",
  },
  {
    table_name: "payments",
    description: "Payment transactions against invoices. Records payment method, amount, and status.",
    columns: "id, invoice_id, amount, method, status, paid_at",
    column_types: "id: integer (primary key, auto-increment), invoice_id: integer (foreign key → invoices.id), amount: real (not null), method: text (values: card, bank_transfer, cash, paypal), status: text (values: completed, pending, failed), paid_at: text",
    relationships: "invoice_id → invoices.id",
    example_queries: "completed payments, payments by method, total payments received, failed payments, payments by date range",
  },
  {
    table_name: "refunds",
    description: "Refund records for orders. Contains refund amount, reason, and processing status.",
    columns: "id, order_id, amount, reason, status, processed_at",
    column_types: "id: integer (primary key, auto-increment), order_id: integer (foreign key → orders.id), amount: real (not null), reason: text, status: text (values: approved, pending, rejected), processed_at: text",
    relationships: "order_id → orders.id",
    example_queries: "approved refunds, pending refunds, total refund amount, refunds by order, refund rate",
  },
  {
    table_name: "warehouses",
    description: "Warehouse locations for inventory storage. Contains address, city, country, and storage capacity.",
    columns: "id, name, address, city, country, capacity",
    column_types: "id: integer (primary key, auto-increment), name: text (not null), address: text, city: text, country: text, capacity: integer",
    relationships: "inventory.warehouse_id → warehouses.id, shipments.warehouse_id → warehouses.id",
    example_queries: "list warehouses, warehouses by country, total warehouse capacity, warehouses in specific city",
  },
  {
    table_name: "inventory",
    description: "Stock levels for each product at each warehouse. Tracks quantity and reorder point.",
    columns: "id, product_id, warehouse_id, quantity, reorder_point",
    column_types: "id: integer (primary key, auto-increment), product_id: integer (foreign key → products.id), warehouse_id: integer (foreign key → warehouses.id), quantity: integer (default 0), reorder_point: integer (default 10)",
    relationships: "product_id → products.id, warehouse_id → warehouses.id",
    example_queries: "low stock items, inventory by warehouse, inventory by product, total stock across warehouses, items below reorder point",
  },
  {
    table_name: "reviews",
    description: "Product reviews and ratings from customers. Rating scale is 1-5.",
    columns: "id, product_id, customer_id, rating, comment, created_at",
    column_types: "id: integer (primary key, auto-increment), product_id: integer (foreign key → products.id), customer_id: integer (foreign key → customers.id), rating: integer (1-5), comment: text, created_at: text (default CURRENT_TIMESTAMP)",
    relationships: "product_id → products.id, customer_id → customers.id",
    example_queries: "reviews for specific product, average rating, 5-star reviews, reviews by customer, most reviewed products",
  },
  {
    table_name: "shipments",
    description: "Shipping and delivery tracking for orders. Contains carrier info, tracking number, and delivery status.",
    columns: "id, order_id, warehouse_id, carrier, tracking_number, status, shipped_at, delivered_at",
    column_types: "id: integer (primary key, auto-increment), order_id: integer (foreign key → orders.id), warehouse_id: integer (foreign key → warehouses.id), carrier: text, tracking_number: text, status: text (values: in_transit, delivered, pending, returned), shipped_at: text, delivered_at: text (nullable)",
    relationships: "order_id → orders.id, warehouse_id → warehouses.id",
    example_queries: "in-transit shipments, delivered shipments, shipments by carrier, pending shipments, shipments by warehouse",
  },
  {
    table_name: "coupons",
    description: "Discount coupon codes with percentage discount, usage limits, and expiration dates.",
    columns: "id, code, discount_percent, max_uses, used_count, expires_at",
    column_types: "id: integer (primary key, auto-increment), code: text (not null), discount_percent: real, max_uses: integer, used_count: integer (default 0), expires_at: text",
    relationships: "none",
    example_queries: "active coupons, expired coupons, most used coupons, coupons by discount percentage, available coupons",
  },
  {
    table_name: "loyalty_points",
    description: "Customer loyalty points earned through purchases, referrals, or bonuses.",
    columns: "id, customer_id, points, reason, earned_at",
    column_types: "id: integer (primary key, auto-increment), customer_id: integer (foreign key → customers.id), points: integer (not null), reason: text (values: purchase, referral, bonus, redemption), earned_at: text",
    relationships: "customer_id → customers.id",
    example_queries: "total points per customer, points by reason, top customers by points, points earned in date range",
  },
  {
    table_name: "vendors",
    description: "Supplier information with contact details and country.",
    columns: "id, name, contact_name, email, phone, country",
    column_types: "id: integer (primary key, auto-increment), name: text (not null), contact_name: text, email: text, phone: text, country: text",
    relationships: "purchase_orders.vendor_id → vendors.id",
    example_queries: "list vendors, vendors by country, vendor contact info, all vendors",
  },
  {
    table_name: "purchase_orders",
    description: "Orders placed to vendors for restocking inventory. Tracks order status and amount.",
    columns: "id, vendor_id, company_id, total_amount, status, order_date",
    column_types: "id: integer (primary key, auto-increment), vendor_id: integer (foreign key → vendors.id), company_id: integer (foreign key → companies.id), total_amount: real (not null), status: text (values: pending, shipped, received, cancelled), order_date: text",
    relationships: "vendor_id → vendors.id, company_id → companies.id",
    example_queries: "pending purchase orders, received purchase orders, total spend with vendors",
  },
  {
    table_name: "departments",
    description: "Organizational units with a head employee and a budget.",
    columns: "id, company_id, name, head_employee_id, budget",
    column_types: "id: integer (primary key, auto-increment), company_id: integer (foreign key → companies.id), name: text (not null), head_employee_id: integer (foreign key → employees.id), budget: real (default 0)",
    relationships: "company_id → companies.id, head_employee_id → employees.id",
    example_queries: "departments by organization, department with highest budget, list all departments",
  },
  {
    table_name: "regions",
    description: "Sales territories or geographic regions. Each region has a manager employee.",
    columns: "id, name, country, manager_employee_id",
    column_types: "id: integer (primary key, auto-increment), name: text (not null), country: text, manager_employee_id: integer (foreign key → employees.id)",
    relationships: "manager_employee_id → employees.id, tax_rates.region_id → regions.id",
    example_queries: "list regions, regions by country, region managers",
  },
  {
    table_name: "tax_rates",
    description: "Tax configuration by region and product category. Defines tax percentage rates.",
    columns: "id, region_id, category, rate_percent, description",
    column_types: "id: integer (primary key, auto-increment), region_id: integer (foreign key → regions.id), category: text, rate_percent: real (not null), description: text",
    relationships: "region_id → regions.id",
    example_queries: "tax rates by region, tax rates by category, highest tax rate, all tax rates",
  },
  {
    table_name: "shipping_addresses",
    description: "Customer delivery addresses. Customers can have multiple addresses (home, office, etc.).",
    columns: "id, customer_id, label, street, city, state, country, zip, is_default",
    column_types: "id: integer (primary key, auto-increment), customer_id: integer (foreign key → customers.id), label: text, street: text, city: text, state: text, country: text, zip: text, is_default: integer (0 or 1)",
    relationships: "customer_id → customers.id",
    example_queries: "shipping addresses for customer, default addresses, addresses by city, addresses by country",
  },
];

async function main() {
  console.log("📝 Seeding schema metadata for SQL RAG...");

  // Clear existing metadata
  await db.delete(schemaMetadataTable);

  // Insert metadata for all 24 tables
  for (const table of tableMetadata) {
    await db.insert(schemaMetadataTable).values(table);
    console.log(`  ✓ ${table.table_name}`);
  }

  console.log(`\n✅ Schema metadata seeded successfully! (${tableMetadata.length} tables)`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export { main };
