-- Users
INSERT INTO Users (name, email, password, phone, is_admin) VALUES
('Aayush', 'aayush@gmail.com', 'pass123', '9876543210', FALSE),
('Rahul', 'rahul@gmail.com', 'pass123', '9876543211', FALSE),
('Sneha', 'sneha@gmail.com', 'pass123', '9876543212', FALSE),
('Admin', 'admin@gmail.com', 'admin123', '9999999999', TRUE),
('Kiran', 'kiran@gmail.com', 'pass123', '9876543213', FALSE);

-- Categories
INSERT INTO Categories (name, parent_id) VALUES
('Electronics', NULL),
('Mobiles', 1),
('Laptops', 1),
('Furniture', NULL),
('Chairs', 4);

-- Items
INSERT INTO Items (seller_id, category_id, title, description, price, condition_type, status)
VALUES
(1, 2, 'iPhone 12', 'Good condition iPhone', 45000, 'used', 'available'),
(2, 3, 'Dell Laptop', 'Gaming laptop', 70000, 'new', 'available'),
(3, 5, 'Office Chair', 'Ergonomic chair', 5000, 'used', 'available'),
(1, 2, 'Samsung Galaxy S21', 'Almost new', 40000, 'used', 'available'),
(5, 3, 'HP Laptop', 'Lightweight laptop', 55000, 'new', 'available');

-- ItemMedia
INSERT INTO ItemMedia (item_id, file_path, media_type) VALUES
(1, 'uploads/images/iphone.jpg', 'image'),
(2, 'uploads/images/dell.jpg', 'image'),
(3, 'uploads/images/chair.jpg', 'image'),
(4, 'uploads/videos/samsung.mp4', 'video'),
(5, 'uploads/images/hp.jpg', 'image');

-- BuyerRequests
INSERT INTO BuyerRequests (buyer_id, category_id, title, description, max_price)
VALUES
(2, 2, 'Looking for iPhone', 'Any good iPhone under budget', 50000),
(3, 3, 'Laptop needed', 'For coding', 60000),
(1, 5, 'Chair required', 'Comfortable chair', 7000),
(5, 2, 'Android phone', 'Good condition', 30000),
(2, 3, 'Gaming laptop', 'High performance', 80000);

-- Alerts
INSERT INTO Alerts (user_id, category_id, min_price, max_price, condition_type)
VALUES
(2, 2, 30000, 50000, 'used'),
(3, 3, 50000, 80000, 'new'),
(1, 5, 2000, 8000, 'used'),
(5, 2, 20000, 45000, 'any'),
(2, 3, 60000, 90000, 'new');

-- Notifications
INSERT INTO Notifications (user_id, item_id, message, is_read)
VALUES
(2, 1, 'New matching item: iPhone 12', FALSE),
(3, 2, 'New matching item: Dell Laptop', TRUE),
(1, 3, 'New matching item: Office Chair', FALSE),
(5, 4, 'New matching item: Samsung Galaxy S21', FALSE),
(2, 5, 'New matching item: HP Laptop', TRUE);

-- Orders
INSERT INTO Orders (buyer_id, seller_id, item_id, price, status)
VALUES
(2, 1, 1, 45000, 'completed'),
(3, 2, 2, 70000, 'completed'),
(1, 3, 3, 5000, 'pending'),
(5, 1, 4, 40000, 'completed'),
(2, 5, 5, 55000, 'pending');

-- Payments
INSERT INTO Payments (order_id, amount, payment_method, payment_status)
VALUES
(1, 45000, 'UPI', 'success'),
(2, 70000, 'Credit Card', 'success'),
(3, 5000, 'Cash', 'pending'),
(4, 40000, 'Debit Card', 'success'),
(5, 55000, 'UPI', 'pending');

-- Reviews
INSERT INTO Reviews (reviewer_id, reviewed_user_id, order_id, rating, comment)
VALUES
(2, 1, 1, 5, 'Great seller!'),
(3, 2, 2, 4, 'Good experience'),
(5, 1, 4, 5, 'Fast delivery'),
(1, 3, 3, 3, 'Average'),
(2, 5, 5, 4, 'Nice product');

-- Wishlist
INSERT INTO Wishlist (user_id, item_id) VALUES
(1, 2),
(2, 3),
(3, 1),
(5, 4),
(1, 5);

-- AdminLogs
INSERT INTO AdminLogs (admin_id, action) VALUES
(4, 'Added category Electronics'),
(4, 'Removed inappropriate item'),
(4, 'Updated category Mobiles'),
(4, 'Verified user Rahul'),
(4, 'Reviewed reported item');

-- SET SQL_SAFE_UPDATES = 0;
-- ALTER TABLE table_name AUTO_INCREMENT = 1;