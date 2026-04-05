-- Procedures for Electronic Marketplace

DELIMITER //

/**
 * Procedural Block for accepting an order.
 * This encapsulates the order update and item status change into a single atomic transaction.
 **/
CREATE PROCEDURE AcceptOrder(IN p_order_id INT, IN p_item_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback if any error occurs
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 1. Update the order status to completed
    UPDATE orders 
    SET status = 'completed' 
    WHERE order_id = p_order_id;

    -- 2. Update the item status to sold
    UPDATE Items 
    SET status = 'sold' 
    WHERE item_id = p_item_id;

    COMMIT;
END //

/**
 * Procedural Block to check if a new item matches any buyer request.
 * Can be called manually or from a trigger.
 **/
CREATE PROCEDURE MatchItemWithRequests(IN p_item_id INT, IN p_category_id INT, IN p_price DECIMAL(10,2), IN p_title VARCHAR(255))
BEGIN
    -- This inserts notifications for any buyer who requested an item that matches
    -- the Category and is within their Max Price budget.
    INSERT INTO Notifications (user_id, item_id, message, is_read, created_at)
    SELECT 
        buyer_id, 
        p_item_id, 
        CONCAT('An item matching your request "', title, '" has just been listed: ', p_title),
        0,
        NOW()
    FROM BuyerRequests
    WHERE category_id = p_category_id AND max_price >= p_price;
END //

DELIMITER ;
