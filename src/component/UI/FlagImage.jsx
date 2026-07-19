"use client";

import Image from "next/image";
import { useState } from "react";
import { getCurrencyFlagUrl } from "@/lib/currencyFlags";

export default function FlagImage({ code, size = 20 }) {
    const src = code ? getCurrencyFlagUrl(code, 40) : null;
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div
                className="shrink-0 rounded-full bg-border"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-border"
            style={{ width: size, height: size }}
        >
            <Image
                src={src}
                alt={code}
                fill
                className="object-cover"
                onError={() => setHasError(true)}
                unoptimized
            />
        </div>
    );
}