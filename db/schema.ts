import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// companies
export const companiesTable = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  industry: text("industry"),
  country: text("country"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// employees
export const employeesTable = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company_id: integer("company_id").references(() => companiesTable.id),

  name: text("name").notNull(),
  email: text("email").notNull(),
  department: text("department"),
  role: text("role"),

  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// customers
export const customersTable = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  company_id: integer("company_id").references(() => companiesTable.id),

  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text("email"),

  city: text("city"),
  state: text("state"),
  country: text("country"),

  signup_date: text("signup_date"),
  status: text("status"), // active, inactive, churned

  total_spent: real("total_spent").default(0),

  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// products
export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  company_id: integer("company_id").references(() => companiesTable.id),

  name: text("name").notNull(),
  category: text("category"),

  price: real("price").notNull(),
  stock: integer("stock").default(0),

  is_active: integer("is_active").default(1),

  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// orders
export const ordersTable = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  company_id: integer("company_id").references(() => companiesTable.id),

  customer_id: integer("customer_id").references(() => customersTable.id),

  order_status: text("order_status"), // completed, pending, refunded

  payment_status: text("payment_status"),

  total_amount: real("total_amount").notNull(),

  order_date: text("order_date").default(sql`CURRENT_TIMESTAMP`),
});

// order_items
export const orderItemsTable = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  order_id: integer("order_id").references(() => ordersTable.id),

  product_id: integer("product_id").references(() => productsTable.id),

  quantity: integer("quantity").notNull(),

  unit_price: real("unit_price").notNull(),

  total_price: real("total_price").notNull(),
});

// subscriptions
export const subscriptionsTable = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  customer_id: integer("customer_id").references(() => customersTable.id),

  plan_name: text("plan_name"),

  monthly_price: real("monthly_price"),

  status: text("status"), // active, canceled, trial

  start_date: text("start_date"),
  end_date: text("end_date"),

  renewal_date: text("renewal_date"),
});

// support_tickets
export const supportTicketsTable = sqliteTable("support_tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  customer_id: integer("customer_id").references(() => customersTable.id),

  subject: text("subject"),

  status: text("status"), // open, closed

  priority: text("priority"), // low, medium, high

  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// campaigns
export const campaignsTable = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  company_id: integer("company_id").references(() => companiesTable.id),

  name: text("name"),

  platform: text("platform"), // google, meta, linkedin

  budget: real("budget"),

  clicks: integer("clicks"),
  conversions: integer("conversions"),

  start_date: text("start_date"),
  end_date: text("end_date"),
});