CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255), -- Increased for secure hashing (e.g., bcrypt/Argon2)
    phone VARCHAR(15),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    parent_id INT,
    path VARCHAR(255), -- Materialized path (e.g., '1/5/12') for fast hierarchical searching
    FOREIGN KEY (parent_id) REFERENCES Categories(category_id)
);

CREATE TABLE Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT,
    category_id INT,
    title VARCHAR(200),
    description TEXT,
    price DECIMAL(10,2) CHECK (price >= 0),
    condition_type ENUM('new', 'used'),
    status ENUM('available', 'sold') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seller_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE ItemMedia (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    file_path VARCHAR(255),
    media_type ENUM('image', 'video'),

    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE BuyerRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT,
    category_id INT,
    title VARCHAR(200),
    description TEXT,
    max_price DECIMAL(10,2) CHECK (max_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (buyer_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    min_price DECIMAL(10,2) DEFAULT 0,
    max_price DECIMAL(10,2),
    condition_type ENUM('new', 'used', 'any') DEFAULT 'any',

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT,
    seller_id INT,
    item_id INT UNIQUE,
    price DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'cancelled'),

    FOREIGN KEY (buyer_id) REFERENCES Users(user_id),
    FOREIGN KEY (seller_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status ENUM('success', 'failed', 'pending'),

    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id INT,
    reviewed_user_id INT,
    order_id INT UNIQUE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id),
    FOREIGN KEY (reviewed_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,

    UNIQUE(user_id, item_id),

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE AdminLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action TEXT,
    target_type VARCHAR(50), -- e.g., 'User', 'Item', 'Category'
    target_id INT,           -- ID of the affected resource
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

ALTER TABLE Items
ADD usage_months INT;