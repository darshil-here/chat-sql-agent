import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================================
// EXISTING TABLES (9)
// ============================================================

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

// ============================================================
// NEW TABLES (15)
// ============================================================

// invoices
export const invoicesTable = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customer_id: integer("customer_id").references(() => customersTable.id),
  invoice_number: text("invoice_number").notNull(),
  amount: real("amount").notNull(),
  tax: real("tax").default(0),
  status: text("status"), // paid, pending, overdue
  due_date: text("due_date"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// payments
export const paymentsTable = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoice_id: integer("invoice_id").references(() => invoicesTable.id),
  amount: real("amount").notNull(),
  method: text("method"), // card, bank_transfer, cash, paypal
  status: text("status"), // completed, pending, failed
  paid_at: text("paid_at"),
});

// refunds
export const refundsTable = sqliteTable("refunds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id").references(() => ordersTable.id),
  amount: real("amount").notNull(),
  reason: text("reason"),
  status: text("status"), // approved, pending, rejected
  processed_at: text("processed_at"),
});

// warehouses
export const warehousesTable = sqliteTable("warehouses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  capacity: integer("capacity"),
});

// inventory
export const inventoryTable = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id").references(() => productsTable.id),
  warehouse_id: integer("warehouse_id").references(() => warehousesTable.id),
  quantity: integer("quantity").default(0),
  reorder_point: integer("reorder_point").default(10),
});

// reviews
export const reviewsTable = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id").references(() => productsTable.id),
  customer_id: integer("customer_id").references(() => customersTable.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// shipments
export const shipmentsTable = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id").references(() => ordersTable.id),
  warehouse_id: integer("warehouse_id").references(() => warehousesTable.id),
  carrier: text("carrier"),
  tracking_number: text("tracking_number"),
  status: text("status"), // in_transit, delivered, pending, returned
  shipped_at: text("shipped_at"),
  delivered_at: text("delivered_at"),
});

// coupons
export const couponsTable = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  discount_percent: real("discount_percent"),
  max_uses: integer("max_uses"),
  used_count: integer("used_count").default(0),
  expires_at: text("expires_at"),
});

// loyalty_points
export const loyaltyPointsTable = sqliteTable("loyalty_points", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customer_id: integer("customer_id").references(() => customersTable.id),
  points: integer("points").notNull(),
  reason: text("reason"), // purchase, referral, bonus, redemption
  earned_at: text("earned_at"),
});

// vendors
export const vendorsTable = sqliteTable("vendors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact_name: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  country: text("country"),
});

// purchase_orders
export const purchaseOrdersTable = sqliteTable("purchase_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendor_id: integer("vendor_id").references(() => vendorsTable.id),
  company_id: integer("company_id").references(() => companiesTable.id),
  total_amount: real("total_amount").notNull(),
  status: text("status"), // pending, shipped, received, cancelled
  order_date: text("order_date"),
});

// departments
export const departmentsTable = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company_id: integer("company_id").references(() => companiesTable.id),
  name: text("name").notNull(),
  head_employee_id: integer("head_employee_id").references(() => employeesTable.id),
  budget: real("budget").default(0),
});

// regions
export const regionsTable = sqliteTable("regions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  country: text("country"),
  manager_employee_id: integer("manager_employee_id").references(() => employeesTable.id),
});

// tax_rates
export const taxRatesTable = sqliteTable("tax_rates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  region_id: integer("region_id").references(() => regionsTable.id),
  category: text("category"),
  rate_percent: real("rate_percent").notNull(),
  description: text("description"),
});

// shipping_addresses
export const shippingAddressesTable = sqliteTable("shipping_addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customer_id: integer("customer_id").references(() => customersTable.id),
  label: text("label"), // home, office, etc.
  street: text("street"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zip: text("zip"),
  is_default: integer("is_default").default(0),
});