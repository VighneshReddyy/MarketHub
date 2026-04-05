-- Functions for Electronic Marketplace

DELIMITER //

-- Get total completed sales of a seller
CREATE FUNCTION GetSellerSales(p_user_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total_sales INT;

    SELECT COUNT(*) INTO total_sales
    FROM Orders
    WHERE seller_id = p_user_id AND status = 'completed';

    RETURN total_sales;
END //

-- Check if a seller is trusted (avg rating >= 4 AND total sales >= 5)
CREATE FUNCTION IsTrustedSeller(p_user_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE total_sales INT;

    SELECT AVG(rating) INTO avg_rating
    FROM Reviews
    WHERE reviewed_user_id = p_user_id;

    SELECT COUNT(*) INTO total_sales
    FROM Orders
    WHERE seller_id = p_user_id AND status = 'completed';

    RETURN (avg_rating >= 4 AND total_sales >= 5);
END //

DELIMITER ;
