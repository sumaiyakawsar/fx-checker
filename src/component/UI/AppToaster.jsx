"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
    return (
        <Toaster
            position="bottom-right"
            gap={10}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: `
                        flex items-center gap-3
                        w-full
                        rounded-2xl
                        border border-border/50
                        bg-bg-elevated/40
                        backdrop-blur-xl
                        px-4 py-3
                        text-sm font-mono text-fg
                        shadow-2xl
                    `,
                    title: "text-fg font-medium",
                    description: "text-fg-muted text-xs",
                    icon: "text-accent shrink-0",
                    success: "[&_[data-icon]]:text-accent",
                    closeButton: `
                        bg-bg-elevated/60
                        border border-border/50
                        text-fg-muted
                        hover:text-fg
                    `,
                },
            }}
        />
    );
}