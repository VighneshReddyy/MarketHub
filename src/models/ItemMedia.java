package models;

public class ItemMedia {
    private int mediaId;
    private int itemId;
    private String mediaUrl;
    private String mediaType; // 'image', 'video'

    public ItemMedia() {}

    public ItemMedia(int itemId, String mediaUrl, String mediaType) {
        this.itemId = itemId;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
    }

    public ItemMedia(int mediaId, int itemId, String mediaUrl, String mediaType) {
        this.mediaId = mediaId;
        this.itemId = itemId;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
    }

    // Getters and Setters
    public int getMediaId() { return mediaId; }
    public void setMediaId(int mediaId) { this.mediaId = mediaId; }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
}
