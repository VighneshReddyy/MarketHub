package ui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import models.User;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class MainApp extends Application {

    public static User currentUser;
    public static final Map<String, Object> tempData = new HashMap<>();
    private static Stage primaryStage;

    @Override
    public void start(Stage stage) throws Exception {
        primaryStage = stage;
        primaryStage.setTitle("Electronic Marketplace");
        switchScene("scenes/Login.fxml");
        primaryStage.show();
    }

    public static void navigateToItemDetail(models.Item item) {
        try {
            URL resource = MainApp.class.getResource("/ui/scenes/ItemDetail.fxml");
            FXMLLoader loader = new FXMLLoader(resource);
            Parent root = loader.load();
            ui.controllers.ItemDetailController controller = loader.getController();
            controller.initData(item);
            
            Scene scene = new Scene(root, 800, 600);
            URL css = MainApp.class.getResource("/ui/styles/style.css");
            if (css != null) scene.getStylesheets().add(css.toExternalForm());
            primaryStage.setScene(scene);
            primaryStage.centerOnScreen();
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Error loading Item Details");
        }
    }

    public static void switchScene(String fxmlPath) {
        try {
            URL resource = MainApp.class.getResource("/ui/" + fxmlPath);
            if (resource == null) {
                System.err.println("Cannot find FXML: /ui/" + fxmlPath);
                return;
            }
            FXMLLoader loader = new FXMLLoader(resource);
            Parent root = loader.load();
            Scene scene = new Scene(root, 800, 600);
            
            // Add stylesheet
            URL css = MainApp.class.getResource("/ui/styles/style.css");
            if (css != null) {
                scene.getStylesheets().add(css.toExternalForm());
            }

            primaryStage.setScene(scene);
            
            // Center stage if scene size changes
            primaryStage.centerOnScreen();
            
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Error loading scene: " + fxmlPath);
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
