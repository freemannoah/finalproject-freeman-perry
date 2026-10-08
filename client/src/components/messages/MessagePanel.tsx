import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import type { Message } from "../../../../shared/types/Message";

interface MessageThread {
    thread_id: string;
    post_id: string;
    other_user_id: string;
    otherUserDisplayName: string;
}

interface MessagePanelProps {
    isPoster: boolean;

    threads: MessageThread[];

    selectedThread: MessageThread | null;

    onThreadChange: (
        thread: MessageThread
    ) => void;

    messages: Message[];

    loading: boolean;

    messageText: string;

    onMessageTextChange: (
        value: string
    ) => void;

    onSendMessage: () => void;

    sending: boolean;

    onStartThread: () => void;

    startingThread: boolean;

    currentUserId?: string;
}

export default function MessagePanel({
    isPoster,
    threads,
    selectedThread,
    onThreadChange,
    messages,
    loading,
    messageText,
    onMessageTextChange,
    onSendMessage,
    sending,
    onStartThread,
    startingThread,
    currentUserId,
}: MessagePanelProps) {
    const hasThread = selectedThread !== null;

    return (
        <Box
            sx={{
                minWidth: 0,

                borderTop: {
                    xs: "1px solid",
                    md: "none",
                },

                borderLeft: {
                    xs: "none",
                    md: "1px solid",
                },

                borderColor: "divider",

                display: "flex",
                flexDirection: "column",

                minHeight: {
                    xs: 500,
                    md: 600,
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                    },
                    py: 2,

                    display: "flex",
                    alignItems: "center",
                    gap: 2,

                    minHeight: 72,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        flex: 1,
                    }}
                >
                    Messages
                </Typography>

                {/* Thread selector */}
                {isPoster && threads.length > 1 && (
                    <Select
                        size="small"
                        value={
                            selectedThread?.thread_id ?? ""
                        }
                        onChange={(event) => {
                            const thread =
                                threads.find(
                                    (item) =>
                                        item.thread_id ===
                                        event.target.value
                                );

                            if (thread) {
                                onThreadChange(thread);
                            }
                        }}
                        sx={{
                            minWidth: {
                                xs: 140,
                                sm: 190,
                            },
                            maxWidth: "50%",
                        }}
                    >
                        {threads.map((thread) => (
                            <MenuItem
                                key={thread.thread_id}
                                value={thread.thread_id}
                            >
                                {thread.otherUserDisplayName}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </Box>

            <Divider />

            {/* No thread */}
            {!hasThread ? (
                <Box
                    sx={{
                        flex: 1,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        p: 3,

                        textAlign: "center",
                    }}
                >
                    {isPoster ? (
                        <Typography
                            color="text.secondary"
                        >
                            No conversations yet.
                        </Typography>
                    ) : (
                        <Stack
                            spacing={2}
                            sx={{alignItems:"center"}}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                You haven't started a
                                conversation with the
                                poster yet.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={onStartThread}
                                disabled={startingThread}
                            >
                                {startingThread
                                    ? "Starting..."
                                    : "Start Conversation"}
                            </Button>
                        </Stack>
                    )}
                </Box>
            ) : (
                <>
                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,

                            minHeight: 0,

                            overflowY: "auto",

                            px: {
                                xs: 2,
                                sm: 3,
                            },

                            py: 2,

                            backgroundColor:
                                "rgba(0,0,0,0.025)",
                        }}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <CircularProgress
                                    size={28}
                                />
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    No messages yet.
                                    <br />
                                    Start the conversation!
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.5}>
                                {messages.map(
                                    (message) => {
                                        const isMine =
                                            message.sender_id ===
                                            currentUserId;

                                        return (
                                            <Box
                                                key={
                                                    message.message_id
                                                }
                                                sx={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        isMine
                                                            ? "flex-end"
                                                            : "flex-start",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth:
                                                            {
                                                                xs: "85%",
                                                                sm: "75%",
                                                            },

                                                        px: 2,
                                                        py: 1.25,

                                                        borderRadius:
                                                            2,

                                                        backgroundColor:
                                                            isMine
                                                                ? "primary.main"
                                                                : "grey.200",

                                                        color: isMine
                                                            ? "primary.contrastText"
                                                            : "text.primary",

                                                        boxShadow:
                                                            "0 1px 3px rgba(0,0,0,0.15)",

                                                        borderBottomRightRadius:
                                                            isMine
                                                                ? 0.5
                                                                : 2,

                                                        borderBottomLeftRadius:
                                                            isMine
                                                                ? 2
                                                                : 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            overflowWrap:
                                                                "anywhere",
                                                        }}
                                                    >
                                                        {
                                                            message.body
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display:
                                                                "block",
                                                            mt: 0.5,

                                                            opacity:
                                                                0.7,

                                                            textAlign:
                                                                isMine
                                                                    ? "right"
                                                                    : "left",
                                                        }}
                                                    >
                                                        {new Date(
                                                            message.time
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    }
                                )}
                            </Stack>
                        )}
                    </Box>

                    <Divider />

                    {/* Message input */}
                    <Box
                        sx={{
                            p: {
                                xs: 1.5,
                                sm: 2,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "flex-end",
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                size="small"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(event) =>
                                    onMessageTextChange(
                                        event.target.value
                                    )
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key ===
                                            "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();

                                        if (
                                            messageText.trim()
                                        ) {
                                            onSendMessage();
                                        }
                                    }
                                }}
                                disabled={sending}
                            />

                            <Button
                                variant="contained"
                                onClick={onSendMessage}
                                disabled={
                                    sending ||
                                    !messageText.trim()
                                }
                                sx={{
                                    minWidth: 48,
                                    width: 48,
                                    height: 40,
                                    p: 0,
                                }}
                            >
                                <SendIcon />
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}