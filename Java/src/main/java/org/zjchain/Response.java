package org.zjchain;

public class Response {
    private final int code;
    private final String content;

    public Response(int code, String content) {
        this.code = code;
        this.content = content;
    }

    public int getCode() {
        return code;
    }

    public String getContent() {
        return content;
    }
}
