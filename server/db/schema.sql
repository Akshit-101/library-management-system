
CREATE TYPE membership_status AS ENUM ('Active', 'Expired');
CREATE TYPE issuance_status AS ENUM ('Issued', 'Returned', 'Overdue', 'Lost');

CREATE TABLE collection_table (
    collection_id SERIAL PRIMARY KEY,
    collection_name VARCHAR(100) NOT NULL UNIQUE CHECK (trim(collection_name) <> '')
);
 
CREATE TABLE category_table (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(100) NOT NULL CHECK (trim(cat_name) <> ''),
    parent_cat_id INT REFERENCES category_table(cat_id) ON DELETE SET NULL
);


CREATE TABLE member_table (
    mem_id SERIAL PRIMARY KEY,
    mem_name VARCHAR(150) NOT NULL CHECK (trim(mem_name) <> ''),
    mem_phone VARCHAR(20) NOT NULL UNIQUE CHECK (trim(mem_phone) <> ''),
    mem_email VARCHAR(150) NOT NULL UNIQUE CHECK (trim(mem_email) <> '')
);

 
CREATE TABLE membership (
    membership_id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES member_table(mem_id) ON DELETE CASCADE,
    status membership_status NOT NULL DEFAULT 'Active'
);


CREATE TABLE book_table (
    book_id SERIAL PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL CHECK (trim(book_name) <> ''),
    book_author VARCHAR(150) NOT NULL CHECK (trim(book_author) <> ''),
    book_cat_id INT NOT NULL REFERENCES category_table(cat_id),
    book_collection_id INT REFERENCES collection_table(collection_id) ON DELETE SET NULL,
    book_launch_date DATE,
    book_publisher VARCHAR(150) CHECK (trim(book_publisher) <> '')
);


CREATE TABLE issuance_table (
    issuance_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES book_table(book_id),
    issuance_member INT NOT NULL REFERENCES member_table(mem_id),
    issuance_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_return_date DATE NOT NULL,
    actual_return_date DATE,
    issued_by VARCHAR(100) NOT NULL DEFAULT 'Admin' CHECK (trim(issued_by) <> ''),
    issuance_status issuance_status NOT NULL DEFAULT 'Issued'
);