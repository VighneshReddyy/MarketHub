package models;

public class Category {
    private int categoryId;
    private String name;
    private Integer parentId;
    private String path;

    public Category(int categoryId, String name, Integer parentId, String path) {
        this.categoryId = categoryId;
        this.name = name;
        this.parentId = parentId;
        this.path = path;
    }

    public Category(String name, Integer parentId, String path) {
        this.name = name;
        this.parentId = parentId;
        this.path = path;
    }

    // Getters and Setters
    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) { this.parentId = parentId; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    @Override
    public String toString() {
        return "Category{" +
                "categoryId=" + categoryId +
                ", name='" + name + '\'' +
                ", parentId=" + parentId +
                ", path='" + path + '\'' +
                '}';
    }
}
