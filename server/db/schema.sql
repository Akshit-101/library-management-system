-- 1.
CREATE TYPE membership_status AS ENUM ('Active', 'Expired');
CREATE TYPE issuance_status AS ENUM ('Issued', 'Returned', 'Overdue', 'Lost');

-- 2. Collection Table
CREATE TABLE collection_table (
    collection_id SERIAL PRIMARY KEY,
    collection_name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Category Table 
CREATE TABLE category_table (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(100) NOT NULL,
    parent_cat_id INT REFERENCES category_table(cat_id) ON DELETE SET NULL
);

-- 4. Member Table
CREATE TABLE member_table (
    mem_id SERIAL PRIMARY KEY,
    mem_name VARCHAR(150) NOT NULL,
    mem_phone VARCHAR(20) NOT NULL UNIQUE,
    mem_email VARCHAR(150) NOT NULL UNIQUE
);

-- 5. Membership Table 
CREATE TABLE membership (
    membership_id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES member_table(mem_id) ON DELETE CASCADE,
    status membership_status NOT NULL DEFAULT 'Active'
);

-- 6. Book Table
CREATE TABLE book_table (
    book_id SERIAL PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    book_cat_id INT NOT NULL REFERENCES category_table(cat_id),
    book_collection_id INT REFERENCES collection_table(collection_id) ON DELETE SET NULL,
    book_launch_date TIMESTAMP,
    book_publisher VARCHAR(150)
);

-- 7. Issuance Table 
CREATE TABLE issuance_table (
    issuance_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES book_table(book_id),
    issuance_member INT NOT NULL REFERENCES member_table(mem_id),
    issuance_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_return_date TIMESTAMP NOT NULL,
    actual_return_date TIMESTAMP,
    issued_by VARCHAR(100) NOT NULL,
    issuance_status issuance_status NOT NULL DEFAULT 'Issued'
);