
-- SEED DATA FOR LIBRARY MANAGEMENT SYSTEM

-- 1. SEED COLLECTIONS (4 collections)
INSERT INTO collection_table (collection_name) VALUES
('Main General Collection'),
('Rare & Academic Reference'),
('New Arrivals & Bestsellers'),
('Digital Media Archive');

-- 2. SEED CATEGORIES 

INSERT INTO category_table (cat_name, parent_cat_id) VALUES
('Computer Science & Tech', NULL),  -- cat_id: 1
('Fiction & Literature', NULL),     -- cat_id: 2
('Science & Mathematics', NULL),    -- cat_id: 3
('History & Biography', NULL);      -- cat_id: 4


INSERT INTO category_table (cat_name, parent_cat_id) VALUES
('Web Development', 1),             -- cat_id: 5
('Data Science & AI', 1),           -- cat_id: 6
('Sci-Fi & Fantasy', 2),            -- cat_id: 7
('Quantum Physics', 3);             -- cat_id: 8

-- 3. SEED MEMBERS (6 members)
INSERT INTO member_table (mem_name, mem_phone, mem_email) VALUES
('Alice Johnson', '+1555019283', 'alice.j@example.com'),
('Bob Smith', '+1555029384', 'bob.smith@example.com'),
('Charlie Brown', '+1555039485', 'charlie.b@example.com'),
('Diana Prince', '+1555049586', 'diana.p@example.com'),
('Evan Wright', '+1555059687', 'evan.w@example.com'),
('Fiona Gallagher', '+1555069788', 'fiona.g@example.com');

-- 4. SEED MEMBERSHIPS 
INSERT INTO membership (member_id, status) VALUES
(1, 'Active'),
(2, 'Active'),
(3, 'Expired'),
(4, 'Active'),
(5, 'Active'),
(6, 'Expired');  

-- 5. SEED BOOKS 
INSERT INTO book_table (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES
('Eloquent JavaScript, 3rd Edition', 5, 1, '2018-12-04 00:00:00', 'No Starch Press'),
('Designing Data-Intensive Applications', 6, 1, '2017-03-16 00:00:00', 'O''Reilly Media'),
('The Hobbit', 7, 3, '1937-09-21 00:00:00', 'George Allen & Unwin'),
('Dune', 7, 3, '1965-08-01 00:00:00', 'Chilton Books'),
('Brief Answers to the Big Questions', 8, 1, '2018-10-16 00:00:00', 'Bantam Books'),
('A Short History of Nearly Everything', 3, 1, '2003-02-04 00:00:00', 'Broadway Books'),
('Sapiens: A Brief History of Humankind', 4, 3, '2011-01-01 00:00:00', 'Harper'),
('Clean Code', 1, 2, '2008-08-01 00:00:00', 'Prentice Hall'),
('Introduction to Algorithms', 1, 2, '2009-07-31 00:00:00', 'MIT Press'),
('The Midnight Library', 2, 3, '2020-08-13 00:00:00', 'Canongate Books'),
('Neuromancer', 7, 1, '1984-07-01 00:00:00', 'Ace Books'),
('Deep Learning', 6, 2, '2016-11-18 00:00:00', 'MIT Press');

-- 6. SEED ISSUANCES 
INSERT INTO issuance_table (book_id, issuance_member, issuance_date, target_return_date, actual_return_date, issued_by, issuance_status) VALUES
-- Pending active books (In-circulation)
(1, 1, '2026-05-20 10:00:00', '2026-06-03 10:00:00', NULL, 'Staff_Sarah', 'Issued'),
(2, 2, '2026-05-25 14:30:00', '2026-06-08 14:30:00', NULL, 'Staff_Sarah', 'Issued'),

-- Successfully returned on time
(3, 4, '2026-04-01 09:00:00', '2026-04-15 09:00:00', '2026-04-12 11:15:00', 'Staff_John', 'Returned'),
(5, 5, '2026-05-01 11:00:00', '2026-05-15 11:00:00', '2026-05-14 16:45:00', 'Staff_Sarah', 'Returned'),
(8, 1, '2026-05-10 10:15:00', '2026-05-24 10:15:00', '2026-05-22 09:00:00', 'Staff_John', 'Returned'),

-- Overdue books (Target return date has passed, actual return date is NULL)
(4, 2, '2026-04-10 12:00:00', '2026-04-24 12:00:00', NULL, 'Staff_John', 'Overdue'),
(6, 4, '2026-05-02 15:00:00', '2026-05-16 15:00:00', NULL, 'Staff_Sarah', 'Overdue'),

-- Lost status item
(7, 3, '2026-03-15 10:00:00', '2026-03-29 10:00:00', NULL, 'Staff_John', 'Lost'),

-- Returned Late (Was overdue historical data point)
(9, 5, '2026-04-15 16:00:00', '2026-04-29 16:00:00', '2026-05-10 14:00:00', 'Staff_Sarah', 'Returned');