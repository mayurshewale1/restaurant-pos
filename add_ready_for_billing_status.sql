-- SQL Script to Add 'ready_for_billing' Status to Orders Enum
-- Run this script in your PostgreSQL database

-- Step 1: Add the new value to the enum type
ALTER TYPE enum_orders_status ADD VALUE IF NOT EXISTS 'ready_for_billing';

-- Note: In PostgreSQL, you cannot remove enum values, only add them.
-- If you need to change the enum, you would need to:
-- 1. Create a new enum type
-- 2. Alter the column to use the new type
-- 3. Drop the old enum type

-- Verify the enum values
SELECT unnest(enum_range(NULL::enum_orders_status));
