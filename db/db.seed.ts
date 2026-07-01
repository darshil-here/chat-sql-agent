import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./db";
import {
  companiesTable,
  employeesTable,
  customersTable,
  productsTable,
  ordersTable,
  orderItemsTable,
  subscriptionsTable,
  supportTicketsTable,
  campaignsTable,
  invoicesTable,
  paymentsTable,
  refundsTable,
  warehousesTable,
  inventoryTable,
  reviewsTable,
  shipmentsTable,
  couponsTable,
  loyaltyPointsTable,
  vendorsTable,
  purchaseOrdersTable,
  departmentsTable,
  regionsTable,
  taxRatesTable,
  shippingAddressesTable,
} from "./schema";

faker.seed(42);

const ORDER_STATUSES = ["completed", "pending", "refunded"] as const;
const PAYMENT_STATUSES = ["paid", "pending", "authorized", "refunded"] as const;
const CUSTOMER_STATUSES = ["active", "inactive", "churned"] as const;
const SUBSCRIPTION_STATUSES = ["active", "canceled", "trial"] as const;
const TICKET_STATUSES = ["open", "closed"] as const;
const TICKET_PRIORITIES = ["low", "medium", "high"] as const;
const PLATFORMS = ["google", "meta", "linkedin", "twitter"] as const;
const INVOICE_STATUSES = ["paid", "pending", "overdue"] as const;
const PAYMENT_METHODS = ["card", "bank_transfer", "cash", "paypal"] as const;
const PAYMENT_TX_STATUSES = ["completed", "pending", "failed"] as const;
const REFUND_STATUSES = ["approved", "pending", "rejected"] as const;
const SHIPMENT_STATUSES = [
  "in_transit",
  "delivered",
  "pending",
  "returned",
] as const;
const LOYALTY_REASONS = [
  "purchase",
  "referral",
  "bonus",
  "redemption",
] as const;
const PO_STATUSES = ["pending", "shipped", "received", "cancelled"] as const;
const PLAN_NAMES = ["Basic", "Starter", "Growth", "Pro", "Enterprise"] as const;

function randomDate(start: Date, end: Date): string {
  return faker.date
    .between({ from: start, to: end })
    .toISOString()
    .split("T")[0];
}

function randomDateTime(start: Date, end: Date): string {
  return faker.date.between({ from: start, to: end }).toISOString();
}

async function main() {
  console.log("🌱 Seeding database with faker...");

  // Clear existing data (children first to satisfy foreign keys)
  await db.delete(shippingAddressesTable);
  await db.delete(taxRatesTable);
  await db.delete(regionsTable);
  await db.delete(departmentsTable);
  await db.delete(purchaseOrdersTable);
  await db.delete(loyaltyPointsTable);
  await db.delete(reviewsTable);
  await db.delete(shipmentsTable);
  await db.delete(refundsTable);
  await db.delete(paymentsTable);
  await db.delete(invoicesTable);
  await db.delete(campaignsTable);
  await db.delete(supportTicketsTable);
  await db.delete(subscriptionsTable);
  await db.delete(orderItemsTable);
  await db.delete(ordersTable);
  await db.delete(inventoryTable);
  await db.delete(productsTable);
  await db.delete(employeesTable);
  await db.delete(customersTable);
  await db.delete(couponsTable);
  await db.delete(warehousesTable);
  await db.delete(vendorsTable);
  await db.delete(companiesTable);

  const startDate = new Date("2024-01-01");
  const endDate = new Date("2025-06-30");

  // ============================================================
  // 1. COMPANIES (20)
  // ============================================================
  console.log("  Seeding companies...");
  const companyIds: number[] = [];
  const companiesData = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    companyIds.push(id);
    return {
      id,
      name: faker.company.name(),
      industry: faker.helpers.arrayElement([
        "SaaS",
        "E-commerce",
        "Healthcare",
        "Fintech",
        "Energy",
        "Transportation",
        "EdTech",
        "Food & Beverage",
        "Gaming",
        "Cybersecurity",
        "Real Estate",
        "Manufacturing",
        "Logistics",
        "Media",
        "Telecommunications",
      ]),
      country: faker.location.country(),
    };
  });
  await db.insert(companiesTable).values(companiesData);

  // ============================================================
  // 2. WAREHOUSES (10)
  // ============================================================
  console.log("  Seeding warehouses...");
  const warehouseIds: number[] = [];
  const warehousesData = Array.from({ length: 10 }, (_, i) => {
    const id = i + 1;
    warehouseIds.push(id);
    return {
      id,
      name: `Warehouse ${faker.location.city()}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      capacity: faker.number.int({ min: 500, max: 5000 }),
    };
  });
  await db.insert(warehousesTable).values(warehousesData);

  // ============================================================
  // 3. VENDORS (30)
  // ============================================================
  console.log("  Seeding vendors...");
  const vendorIds: number[] = [];
  const vendorsData = Array.from({ length: 30 }, (_, i) => {
    const id = i + 1;
    vendorIds.push(id);
    return {
      id,
      name: faker.company.name(),
      contact_name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      country: faker.location.country(),
    };
  });
  await db.insert(vendorsTable).values(vendorsData);

  // ============================================================
  // 4. COUPONS (50)
  // ============================================================
  console.log("  Seeding coupons...");
  const couponsData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    code: faker.string.alphanumeric(8).toUpperCase(),
    discount_percent: faker.number.float({
      min: 5,
      max: 50,
      fractionDigits: 0,
    }),
    max_uses: faker.number.int({ min: 10, max: 500 }),
    used_count: faker.number.int({ min: 0, max: 100 }),
    expires_at: randomDate(new Date("2025-06-01"), new Date("2026-12-31")),
  }));
  await db.insert(couponsTable).values(couponsData);

  // ============================================================
  // 5. REGIONS (10)
  // ============================================================
  console.log("  Seeding regions...");
  const regionIds: number[] = [];
  const regionsData = Array.from({ length: 10 }, (_, i) => {
    const id = i + 1;
    regionIds.push(id);
    return {
      id,
      name: faker.location.city(),
      country: faker.location.country(),
    };
  });
  await db.insert(regionsTable).values(regionsData);

  // ============================================================
  // 6. EMPLOYEES (200)
  // ============================================================
  console.log("  Seeding employees...");
  const employeeIds: number[] = [];
  const employeesData = Array.from({ length: 200 }, (_, i) => {
    const id = i + 1;
    employeeIds.push(id);
    return {
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      department: faker.helpers.arrayElement([
        "Engineering",
        "Marketing",
        "Sales",
        "Finance",
        "Operations",
        "Product",
        "Design",
        "HR",
        "Legal",
        "Support",
        "R&D",
        "Data Science",
      ]),
      role: faker.person.jobTitle(),
    };
  });
  await db.insert(employeesTable).values(employeesData);

  // ============================================================
  // 7. CUSTOMERS (500)
  // ============================================================
  console.log("  Seeding customers...");
  const customerIds: number[] = [];
  const customersData = Array.from({ length: 500 }, (_, i) => {
    const id = i + 1;
    customerIds.push(id);
    return {
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      signup_date: randomDate(startDate, endDate),
      status: faker.helpers.arrayElement(CUSTOMER_STATUSES),
      total_spent: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
    };
  });
  await db.insert(customersTable).values(customersData);

  // ============================================================
  // 8. DEPARTMENTS (15)
  // ============================================================
  console.log("  Seeding departments...");
  const departmentsData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    company_id: faker.helpers.arrayElement(companyIds),
    name: faker.commerce.department(),
    head_employee_id: faker.helpers.arrayElement(employeeIds),
    budget: faker.number.float({ min: 10000, max: 500000, fractionDigits: 2 }),
  }));
  await db.insert(departmentsTable).values(departmentsData);

  // ============================================================
  // 9. PRODUCTS (100)
  // ============================================================
  console.log("  Seeding products...");
  const productIds: number[] = [];
  const productsData = Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    productIds.push(id);
    return {
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      price: faker.number.float({ min: 5, max: 999, fractionDigits: 2 }),
      stock: faker.number.int({ min: 0, max: 500 }),
      is_active: faker.helpers.arrayElement([0, 1]),
    };
  });
  await db.insert(productsTable).values(productsData);

  // ============================================================
  // 10. ORDERS (1000)
  // ============================================================
  console.log("  Seeding orders...");
  const orderIds: number[] = [];
  const ordersData = Array.from({ length: 1000 }, (_, i) => {
    const id = i + 1;
    orderIds.push(id);
    return {
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      customer_id: faker.helpers.arrayElement(customerIds),
      order_status: faker.helpers.arrayElement(ORDER_STATUSES),
      payment_status: faker.helpers.arrayElement(PAYMENT_STATUSES),
      total_amount: faker.number.float({
        min: 10,
        max: 2000,
        fractionDigits: 2,
      }),
      order_date: randomDate(startDate, endDate),
    };
  });
  await db.insert(ordersTable).values(ordersData);

  // ============================================================
  // 11. ORDER_ITEMS (2000)
  // ============================================================
  console.log("  Seeding order items...");
  const orderItemsData = Array.from({ length: 2000 }, (_, i) => {
    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitPrice = faker.number.float({
      min: 5,
      max: 500,
      fractionDigits: 2,
    });
    return {
      id: i + 1,
      order_id: faker.helpers.arrayElement(orderIds),
      product_id: faker.helpers.arrayElement(productIds),
      quantity,
      unit_price: unitPrice,
      total_price: parseFloat((quantity * unitPrice).toFixed(2)),
    };
  });
  await db.insert(orderItemsTable).values(orderItemsData);

  // ============================================================
  // 12. SUBSCRIPTIONS (300)
  // ============================================================
  console.log("  Seeding subscriptions...");
  const subscriptionsData = Array.from({ length: 300 }, (_, i) => {
    const status = faker.helpers.arrayElement(SUBSCRIPTION_STATUSES);
    const startDateStr = randomDate(startDate, endDate);
    return {
      id: i + 1,
      customer_id: faker.helpers.arrayElement(customerIds),
      plan_name: faker.helpers.arrayElement(PLAN_NAMES),
      monthly_price: faker.number.float({
        min: 9.99,
        max: 199,
        fractionDigits: 2,
      }),
      status,
      start_date: startDateStr,
      end_date:
        status === "canceled"
          ? randomDate(new Date(startDateStr), endDate)
          : null,
      renewal_date:
        status === "active"
          ? randomDate(endDate, new Date("2026-06-30"))
          : null,
    };
  });
  await db.insert(subscriptionsTable).values(subscriptionsData);

  // ============================================================
  // 13. SUPPORT_TICKETS (400)
  // ============================================================
  console.log("  Seeding support tickets...");
  const supportTicketsData = Array.from({ length: 400 }, (_, i) => ({
    id: i + 1,
    customer_id: faker.helpers.arrayElement(customerIds),
    subject: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(TICKET_STATUSES),
    priority: faker.helpers.arrayElement(TICKET_PRIORITIES),
    created_at: randomDateTime(startDate, endDate),
  }));
  await db.insert(supportTicketsTable).values(supportTicketsData);

  // ============================================================
  // 14. CAMPAIGNS (100)
  // ============================================================
  console.log("  Seeding campaigns...");
  const campaignsData = Array.from({ length: 100 }, (_, i) => {
    const start = randomDate(startDate, endDate);
    return {
      id: i + 1,
      company_id: faker.helpers.arrayElement(companyIds),
      name: `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()}`,
      platform: faker.helpers.arrayElement(PLATFORMS),
      budget: faker.number.float({ min: 500, max: 10000, fractionDigits: 2 }),
      clicks: faker.number.int({ min: 100, max: 10000 }),
      conversions: faker.number.int({ min: 10, max: 1000 }),
      start_date: start,
      end_date: randomDate(new Date(start), new Date("2026-06-30")),
    };
  });
  await db.insert(campaignsTable).values(campaignsData);

  // ============================================================
  // 15. INVOICES (800)
  // ============================================================
  console.log("  Seeding invoices...");
  const invoiceIds: number[] = [];
  const invoicesData = Array.from({ length: 800 }, (_, i) => {
    const id = i + 1;
    invoiceIds.push(id);
    return {
      id,
      customer_id: faker.helpers.arrayElement(customerIds),
      invoice_number: `INV-${faker.string.numeric(6)}`,
      amount: faker.number.float({ min: 20, max: 3000, fractionDigits: 2 }),
      tax: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(INVOICE_STATUSES),
      due_date: randomDate(endDate, new Date("2026-06-30")),
    };
  });
  await db.insert(invoicesTable).values(invoicesData);

  // ============================================================
  // 16. PAYMENTS (800)
  // ============================================================
  console.log("  Seeding payments...");
  const paymentsData = Array.from({ length: 800 }, (_, i) => ({
    id: i + 1,
    invoice_id: faker.helpers.arrayElement(invoiceIds),
    amount: faker.number.float({ min: 20, max: 3000, fractionDigits: 2 }),
    method: faker.helpers.arrayElement(PAYMENT_METHODS),
    status: faker.helpers.arrayElement(PAYMENT_TX_STATUSES),
    paid_at: randomDateTime(startDate, endDate),
  }));
  await db.insert(paymentsTable).values(paymentsData);

  // ============================================================
  // 17. REFUNDS (100)
  // ============================================================
  console.log("  Seeding refunds...");
  const refundsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    order_id: faker.helpers.arrayElement(orderIds),
    amount: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
    reason: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(REFUND_STATUSES),
    processed_at: randomDateTime(startDate, endDate),
  }));
  await db.insert(refundsTable).values(refundsData);

  // ============================================================
  // 18. INVENTORY (500)
  // ============================================================
  console.log("  Seeding inventory...");
  const inventoryData = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    product_id: faker.helpers.arrayElement(productIds),
    warehouse_id: faker.helpers.arrayElement(warehouseIds),
    quantity: faker.number.int({ min: 0, max: 500 }),
    reorder_point: faker.number.int({ min: 5, max: 50 }),
  }));
  await db.insert(inventoryTable).values(inventoryData);

  // ============================================================
  // 19. REVIEWS (500)
  // ============================================================
  console.log("  Seeding reviews...");
  const reviewsData = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    product_id: faker.helpers.arrayElement(productIds),
    customer_id: faker.helpers.arrayElement(customerIds),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.paragraph(),
    created_at: randomDateTime(startDate, endDate),
  }));
  await db.insert(reviewsTable).values(reviewsData);

  // ============================================================
  // 20. SHIPMENTS (600)
  // ============================================================
  console.log("  Seeding shipments...");
  const shipmentsData = Array.from({ length: 600 }, (_, i) => {
    const shippedDate = randomDateTime(startDate, endDate);
    const status = faker.helpers.arrayElement(SHIPMENT_STATUSES);
    return {
      id: i + 1,
      order_id: faker.helpers.arrayElement(orderIds),
      warehouse_id: faker.helpers.arrayElement(warehouseIds),
      carrier: faker.helpers.arrayElement([
        "FedEx",
        "UPS",
        "DHL",
        "USPS",
        "Amazon Logistics",
      ]),
      tracking_number: faker.string.uuid(),
      status,
      shipped_at: shippedDate,
      delivered_at:
        status === "delivered"
          ? randomDateTime(new Date(shippedDate), endDate)
          : null,
    };
  });
  await db.insert(shipmentsTable).values(shipmentsData);

  // ============================================================
  // 21. LOYALTY_POINTS (500)
  // ============================================================
  console.log("  Seeding loyalty points...");
  const loyaltyPointsData = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    customer_id: faker.helpers.arrayElement(customerIds),
    points: faker.number.int({ min: 10, max: 1000 }),
    reason: faker.helpers.arrayElement(LOYALTY_REASONS),
    earned_at: randomDateTime(startDate, endDate),
  }));
  await db.insert(loyaltyPointsTable).values(loyaltyPointsData);

  // ============================================================
  // 22. PURCHASE_ORDERS (100)
  // ============================================================
  console.log("  Seeding purchase orders...");
  const purchaseOrdersData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    vendor_id: faker.helpers.arrayElement(vendorIds),
    company_id: faker.helpers.arrayElement(companyIds),
    total_amount: faker.number.float({
      min: 100,
      max: 10000,
      fractionDigits: 2,
    }),
    status: faker.helpers.arrayElement(PO_STATUSES),
    order_date: randomDate(startDate, endDate),
  }));
  await db.insert(purchaseOrdersTable).values(purchaseOrdersData);

  // ============================================================
  // 23. TAX_RATES (20)
  // ============================================================
  console.log("  Seeding tax rates...");
  const taxRatesData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    region_id: faker.helpers.arrayElement(regionIds),
    category: faker.helpers.arrayElement([
      "electronics",
      "clothing",
      "food",
      "services",
      "software",
      "hardware",
      "furniture",
      "books",
      "medical",
      "automotive",
    ]),
    rate_percent: faker.number.float({ min: 0, max: 25, fractionDigits: 2 }),
    description: faker.lorem.sentence(),
  }));
  await db.insert(taxRatesTable).values(taxRatesData);

  // ============================================================
  // 24. SHIPPING_ADDRESSES (500)
  // ============================================================
  console.log("  Seeding shipping addresses...");
  const shippingAddressesData = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    customer_id: faker.helpers.arrayElement(customerIds),
    label: faker.helpers.arrayElement([
      "Home",
      "Office",
      "Billing",
      "Shipping",
    ]),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zip: faker.location.zipCode(),
    is_default: faker.number.int({ min: 0, max: 1 }),
  }));
  await db.insert(shippingAddressesTable).values(shippingAddressesData);

  console.log("✅ Database seeded successfully!");
  console.log(`   Total: 24 tables, ~8,335 rows`);
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export { main };
