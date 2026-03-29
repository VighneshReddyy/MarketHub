#!/bin/bash

# Configuration
JAVA_HOME_BREW="/opt/homebrew/opt/openjdk"
JAVAC="$JAVA_HOME_BREW/bin/javac"
JAVA="$JAVA_HOME_BREW/bin/java"
JAVAFX_LIB="/Users/aayushvivekraj/javafx-sdk-25.0.2/lib"
JDBC_LIB="lib/mysql-connector-j-8.3.0.jar"
SRC_DIR="src"
OUT_DIR="bin"
MAIN_CLASS="Main"

# 1. Clean and Create output directory
echo "Cleaning output directory..."
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# 2. Find all java source files
JAVA_FILES=$(find "$SRC_DIR" -name "*.java")

# 3. Compile
echo "Compiling Java source files using JDK 25..."
"$JAVAC" --module-path "$JAVAFX_LIB" \
      --add-modules javafx.controls,javafx.fxml \
      -cp "$JDBC_LIB" \
      -d "$OUT_DIR" \
      $JAVA_FILES

if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    exit 1
fi

# 4. Copy resources (FXML and CSS files)
echo "Copying UI resources (FXML/CSS) to output directory..."
find "$SRC_DIR" -type f \( -name "*.fxml" -o -name "*.css" \) | while read -r resource_file; do
    # Calculate the relative path from the src folder
    relative_path="${resource_file#$SRC_DIR/}"
    dest_dir="$OUT_DIR/$(dirname "$relative_path")"
    
    mkdir -p "$dest_dir"
    cp "$resource_file" "$dest_dir"
done

# 5. Run the application
echo "Launching Marketplace Application using JDK 25..."
"$JAVA" --module-path "$JAVAFX_LIB" \
     --add-modules javafx.controls,javafx.fxml \
     -cp "$OUT_DIR:$JDBC_LIB" \
     "$MAIN_CLASS"
