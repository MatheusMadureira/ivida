"use client";

import { useRef, useState, useCallback } from "react";
import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB — obrigatório (validado também no backend)
const TARGET_MAX_SIZE_MB = 0.15; // 150KB — compressor
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AvatarUploadProps = {
  photoUrl: string | null;
  initials: string;
  onPhotoUpdate: (url: string) => void;
  /** Tamanho do avatar em pixels (quadrado). */
  size?: number;
  className?: string;
  /** Se true, exibe apenas a foto/iniciais sem botão de alterar. */
  readOnly?: boolean;
};

export function AvatarUpload({
  photoUrl,
  initials,
  onPhotoUpdate,
  size = 64,
  className = "",
  readOnly = false,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const displayUrl = preview || photoUrl;

  if (readOnly) {
    return (
      <div
        className={`relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-white/5 text-white/80 font-medium border border-white/10 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
        aria-hidden
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt=""
            className="w-full h-full object-cover object-[50%_15%]"
            width={size}
            height={size}
          />
        ) : (
          initials
        )}
      </div>
    );
  }

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
  }, []);

  const handleClick = useCallback(() => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      clearPreview();

      // Validação no frontend (obrigatória — limite 2MB e tipo)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError("A imagem deve ter no máximo 2MB. Escolha uma foto menor.");
        e.target.value = "";
        return;
      }
      const type = file.type?.toLowerCase() ?? "";
      if (!ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
        setError("Use apenas JPEG, PNG ou WebP.");
        e.target.value = "";
        return;
      }

      setLoading(true);
      e.target.value = "";

      let fileToUpload = file;
      try {
        fileToUpload = await imageCompression(file, {
          maxSizeMB: TARGET_MAX_SIZE_MB,
          maxWidthOrHeight: 512,
          useWebWorker: true,
          fileType: (file.type as "image/jpeg" | "image/png" | "image/webp") || "image/jpeg",
        });
      } catch {
        // mantém o arquivo original se a compressão falhar
      }

      const url = URL.createObjectURL(fileToUpload);
      previewUrlRef.current = url;
      setPreview(url);

      let data: { url?: string; error?: string } = {};
      try {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        const res = await fetch("/api/profile/upload-avatar", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Não foi possível enviar a foto. Tente novamente.");
          return;
        }
        if (data.url) {
          onPhotoUpdate(data.url);
          setTimeout(() => clearPreview(), 0);
        }
      } catch {
        setError("Erro de conexão. Tente novamente.");
      } finally {
        setLoading(false);
        if (!data?.url) clearPreview();
        setInputKey((k) => k + 1);
      }
    },
    [clearPreview, onPhotoUpdate]
  );

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-white/5 text-white/80 font-medium cursor-pointer border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:pointer-events-none transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] group"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
        aria-label="Alterar foto de perfil"
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={displayUrl}
            src={displayUrl}
            alt=""
            className="w-full h-full object-cover object-[50%_15%]"
            width={size}
            height={size}
          />
        ) : (
          initials
        )}
        {/* Overlay no hover: ícone de câmera + "Alterar foto" */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          aria-hidden
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"
            />
          </svg>
          <span className="text-[10px] sm:text-xs text-white font-medium">Alterar foto</span>
        </span>
        {/* Loader durante envio */}
        {loading && (
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full"
            aria-hidden
          >
            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </span>
        )}
      </button>

      <input
        key={inputKey}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="sr-only"
        aria-hidden
      />

      {error && (
        <p
          className="mt-2 text-xs text-ivida-red max-w-[200px]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
