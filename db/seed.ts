import { faker } from "@faker-js/faker";
import { getTableName } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { db } from "./client";
import { valueDomains } from "./catalog";
import { seedCatalog } from "./seed-catalog";
import {
  campaignsTable,
  companiesTable,
  couponsTable,
  customersTable,
  departmentsTable,
  employeesTable,
  inventoryTable,
  invoicesTable,
  loyaltyPointsTable,
  orderItemsTable,
  ordersTable,
  paymentsTable,
  productsTable,
  purchaseOrdersTable,
  refundsTable,
  regionsTable,
  reviewsTable,
  shipmentsTable,
  shippingAddressesTable,
  subscriptionsTable,
  supportTicketsTable,
  tablesInForeignKeyOrder,
  taxRatesTable,
  vendorsTable,
  warehousesTable,
} from "./schema";

faker.seed(42);

const TODAY = new Date();
const START_DATE = new Date(TODAY);
START_DATE.setFullYear(START_DATE.getFullYear() - 1);
const FUTURE_DATE = new Date(TODAY);
FUTURE_DATE.setMonth(FUTURE_DATE.getMonth() + 6);

export interface SeedResult {
  tables: number;
  rows: number;
}

function idRange(length: number): number[] {
  return Array.from({ length }, (_, index) => index + 1);
}

function randomDate(start: Date, end: Date): string {
  return faker.date.between({ from: start, to: end }).toISOString().split("T")[0];
}

function randomDateTime(start: Date, end: Date): string {
  return faker.date.between({ from: start, to: end }).toISOString();
}

function rows<T>(length: number, make: (id: number) => T): T[] {
  return idRange(length).map(make);
}

export async function seedDatabase(): Promise<SeedResult> {
  console.log("Clearing tables…");
  for (const table of [...tablesInForeignKeyOrder].reverse()) {
    await db.delete(table);
  }

  let rowCount = 0;
  const seeded = new Set<string>();

  async function insert<T extends SQLiteTable>(
    table: T,
    values: T["$inferInsert"][],
  ): Promise<void> {
    await db.insert(table).values(values);
    rowCount += values.length;
    const name = getTableName(table);
    seeded.add(name);
    console.log(`  ${name}: ${values.length}`);
  }

  const companyIds = idRange(20);
  await insert(
    companiesTable,
    rows(companyIds.length, (id) => ({
      id,
      name: faker.company.name(),
      industry: faker.helpers.arrayElement(valueDomains.industries),
      country: faker.location.country(),
    })),
  );

  const employeeIds = idRange(200);
  await insert(
    employeesTable,
    rows(employeeIds.length, (id) => ({
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      department: faker.helpers.arrayElement(valueDomains.departments),
      role: faker.person.jobTitle(),
    })),
  );

  const regionIds = idRange(10);
  await insert(
    regionsTable,
    rows(regionIds.length, (id) => ({
      id,
      name: faker.location.city(),
      country: faker.location.country(),
      manager_employee_id: faker.helpers.arrayElement(employeeIds),
    })),
  );

  const warehouseIds = idRange(10);
  await insert(
    warehousesTable,
    rows(warehouseIds.length, (id) => ({
      id,
      name: `Warehouse ${faker.location.city()}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      capacity: faker.number.int({ min: 500, max: 5000 }),
    })),
  );

  const vendorIds = idRange(30);
  await insert(
    vendorsTable,
    rows(vendorIds.length, (id) => ({
      id,
      name: faker.company.name(),
      contact_name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      country: faker.location.country(),
    })),
  );

  await insert(
    couponsTable,
    rows(50, (id) => ({
      id,
      code: faker.string.alphanumeric(8).toUpperCase(),
      discount_percent: faker.number.float({ min: 5, max: 50, fractionDigits: 0 }),
      max_uses: faker.number.int({ min: 10, max: 500 }),
      used_count: faker.number.int({ min: 0, max: 100 }),
      expires_at: randomDate(START_DATE, FUTURE_DATE),
    })),
  );

  const customerIds = idRange(500);
  await insert(
    customersTable,
    rows(customerIds.length, (id) => ({
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      signup_date: randomDate(START_DATE, TODAY),
      status: faker.helpers.arrayElement(valueDomains.customerStatuses),
      total_spent: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
    })),
  );

  await insert(
    departmentsTable,
    rows(15, (id) => ({
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      name: faker.helpers.arrayElement(valueDomains.departments),
      head_employee_id: faker.helpers.arrayElement(employeeIds),
      budget: faker.number.float({ min: 10000, max: 500000, fractionDigits: 2 }),
    })),
  );

  const productIds = idRange(100);
  await insert(
    productsTable,
    rows(productIds.length, (id) => ({
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(valueDomains.taxCategories),
      price: faker.number.float({ min: 5, max: 999, fractionDigits: 2 }),
      stock: faker.number.int({ min: 0, max: 500 }),
      is_active: faker.helpers.arrayElement([0, 1]),
    })),
  );

  const orderIds = idRange(1000);
  await insert(
    ordersTable,
    rows(orderIds.length, (id) => ({
      id,
      company_id: faker.helpers.arrayElement(companyIds),
      customer_id: faker.helpers.arrayElement(customerIds),
      order_status: faker.helpers.arrayElement(valueDomains.orderStatuses),
      payment_status: faker.helpers.arrayElement(valueDomains.paymentStatuses),
      total_amount: faker.number.float({ min: 10, max: 2000, fractionDigits: 2 }),
      order_date: randomDate(START_DATE, TODAY),
    })),
  );

  await insert(
    orderItemsTable,
    rows(2000, (id) => {
      const quantity = faker.number.int({ min: 1, max: 10 });
      const unitPrice = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
      return {
        id,
        order_id: faker.helpers.arrayElement(orderIds),
        product_id: faker.helpers.arrayElement(productIds),
        quantity,
        unit_price: unitPrice,
        total_price: parseFloat((quantity * unitPrice).toFixed(2)),
      };
    }),
  );

  await insert(
    subscriptionsTable,
    rows(300, (id) => {
      const status = faker.helpers.arrayElement(valueDomains.subscriptionStatuses);
      const startDate = randomDate(START_DATE, TODAY);
      return {
        id,
        customer_id: faker.helpers.arrayElement(customerIds),
        plan_name: faker.helpers.arrayElement(valueDomains.planNames),
        monthly_price: faker.number.float({ min: 9.99, max: 199, fractionDigits: 2 }),
        status,
        start_date: startDate,
        end_date:
          status === "canceled" ? randomDate(new Date(startDate), TODAY) : null,
        renewal_date:
          status === "active" ? randomDate(TODAY, FUTURE_DATE) : null,
      };
    }),
  );

  await insert(
    supportTicketsTable,
    rows(400, (id) => ({
      id,
      customer_id: faker.helpers.arrayElement(customerIds),
      subject: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(valueDomains.ticketStatuses),
      priority: faker.helpers.arrayElement(valueDomains.ticketPriorities),
      created_at: randomDateTime(START_DATE, TODAY),
    })),
  );

  await insert(
    campaignsTable,
    rows(100, (id) => {
      const start = randomDate(START_DATE, TODAY);
      return {
        id,
        company_id: faker.helpers.arrayElement(companyIds),
        name: `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()}`,
        platform: faker.helpers.arrayElement(valueDomains.platforms),
        budget: faker.number.float({ min: 500, max: 10000, fractionDigits: 2 }),
        clicks: faker.number.int({ min: 100, max: 10000 }),
        conversions: faker.number.int({ min: 10, max: 1000 }),
        start_date: start,
        end_date: randomDate(new Date(start), FUTURE_DATE),
      };
    }),
  );

  const invoiceIds = idRange(800);
  await insert(
    invoicesTable,
    rows(invoiceIds.length, (id) => ({
      id,
      customer_id: faker.helpers.arrayElement(customerIds),
      invoice_number: `INV-${faker.string.numeric(6)}`,
      amount: faker.number.float({ min: 20, max: 3000, fractionDigits: 2 }),
      tax: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(valueDomains.invoiceStatuses),
      due_date: randomDate(TODAY, FUTURE_DATE),
    })),
  );

  await insert(
    paymentsTable,
    rows(800, (id) => ({
      id,
      invoice_id: faker.helpers.arrayElement(invoiceIds),
      amount: faker.number.float({ min: 20, max: 3000, fractionDigits: 2 }),
      method: faker.helpers.arrayElement(valueDomains.paymentMethods),
      status: faker.helpers.arrayElement(valueDomains.paymentTransactionStatuses),
      paid_at: randomDateTime(START_DATE, TODAY),
    })),
  );

  await insert(
    refundsTable,
    rows(100, (id) => ({
      id,
      order_id: faker.helpers.arrayElement(orderIds),
      amount: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
      reason: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(valueDomains.refundStatuses),
      processed_at: randomDateTime(START_DATE, TODAY),
    })),
  );

  await insert(
    inventoryTable,
    rows(500, (id) => ({
      id,
      product_id: faker.helpers.arrayElement(productIds),
      warehouse_id: faker.helpers.arrayElement(warehouseIds),
      quantity: faker.number.int({ min: 0, max: 500 }),
      reorder_point: faker.number.int({ min: 5, max: 50 }),
    })),
  );

  await insert(
    reviewsTable,
    rows(500, (id) => ({
      id,
      product_id: faker.helpers.arrayElement(productIds),
      customer_id: faker.helpers.arrayElement(customerIds),
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      created_at: randomDateTime(START_DATE, TODAY),
    })),
  );

  await insert(
    shipmentsTable,
    rows(600, (id) => {
      const shippedAt = randomDateTime(START_DATE, TODAY);
      const status = faker.helpers.arrayElement(valueDomains.shipmentStatuses);
      return {
        id,
        order_id: faker.helpers.arrayElement(orderIds),
        warehouse_id: faker.helpers.arrayElement(warehouseIds),
        carrier: faker.helpers.arrayElement(valueDomains.carriers),
        tracking_number: faker.string.uuid(),
        status,
        shipped_at: shippedAt,
        delivered_at:
          status === "delivered" ? randomDateTime(new Date(shippedAt), TODAY) : null,
      };
    }),
  );

  await insert(
    loyaltyPointsTable,
    rows(500, (id) => ({
      id,
      customer_id: faker.helpers.arrayElement(customerIds),
      points: faker.number.int({ min: 10, max: 1000 }),
      reason: faker.helpers.arrayElement(valueDomains.loyaltyReasons),
      earned_at: randomDateTime(START_DATE, TODAY),
    })),
  );

  await insert(
    purchaseOrdersTable,
    rows(100, (id) => ({
      id,
      vendor_id: faker.helpers.arrayElement(vendorIds),
      company_id: faker.helpers.arrayElement(companyIds),
      total_amount: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(valueDomains.purchaseOrderStatuses),
      order_date: randomDate(START_DATE, TODAY),
    })),
  );

  await insert(
    taxRatesTable,
    rows(20, (id) => ({
      id,
      region_id: faker.helpers.arrayElement(regionIds),
      category: faker.helpers.arrayElement(valueDomains.taxCategories),
      rate_percent: faker.number.float({ min: 0, max: 25, fractionDigits: 2 }),
      description: faker.lorem.sentence(),
    })),
  );

  await insert(
    shippingAddressesTable,
    rows(500, (id) => ({
      id,
      customer_id: faker.helpers.arrayElement(customerIds),
      label: faker.helpers.arrayElement(valueDomains.shippingLabels),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      is_default: faker.number.int({ min: 0, max: 1 }),
    })),
  );

  const catalogTables = await seedCatalog();
  console.log(`  schema_metadata: ${catalogTables}`);

  const missing = tablesInForeignKeyOrder
    .map(getTableName)
    .filter((name) => !seeded.has(name));
  if (missing.length > 0) {
    throw new Error(`Seed did not insert: ${missing.join(", ")}`);
  }

  return { tables: tablesInForeignKeyOrder.length, rows: rowCount };
}
