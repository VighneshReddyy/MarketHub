-- Delete existing triggers if they exist
DROP TRIGGER IF EXISTS after_item_insert;
DROP TRIGGER IF EXISTS after_order_insert;

DELIMITER $$

-- Trigger to match Alerts when a new Item is listed
CREATE TRIGGER after_item_insert
AFTER INSERT ON Items
FOR EACH ROW
BEGIN
    INSERT INTO Notifications(user_id, item_id, message)
    SELECT user_id, NEW.item_id, CONCAT('New alert match: ', NEW.title)
    FROM Alerts
    WHERE category_id = NEW.category_id
      AND NEW.price BETWEEN min_price AND max_price
      AND (condition_type = 'any' OR condition_type = NEW.condition_type);
END$$
DELIMITER ;
