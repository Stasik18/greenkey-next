import type { RefObject } from "react";
import Link from "next/link";
import { LeadForm } from "@/shared/ui/lead-form";

interface GalleryCallModalProps {
  callTitle: string;
  callContext: string;
  closeCall: () => void;
  callModalRef: RefObject<HTMLDivElement | null>;
}

export function GalleryCallModal({
  callTitle,
  callContext,
  closeCall,
  callModalRef,
}: GalleryCallModalProps) {
  return (
    <div
      ref={callModalRef}
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-call-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCall();
      }}
    >
      <div className="modal">
        <button
          type="button"
          className="modal-close"
          aria-label="Закрыть"
          data-autofocus
          onClick={closeCall}
        >
          ×
        </button>
        <h2 id="modal-call-title">{callTitle}</h2>
        <p>
          Оставьте контакты - перезвоним, ответим на вопросы и рассчитаем
          стоимость вашего дома.
        </p>

        <LeadForm
          source="gallery-call"
          className="modal-form"
          onSuccess={() => window.setTimeout(closeCall, 1500)}
        >
          <div className="form-group">
            <label htmlFor="gallery-call-name">Ваше имя</label>
            <input
              type="text"
              id="gallery-call-name"
              name="name"
              autoComplete="name"
              maxLength={80}
              placeholder="Иван Иванов"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gallery-call-phone">Телефон</label>
            <input
              type="tel"
              id="gallery-call-phone"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              maxLength={24}
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
          <input type="hidden" name="comment" value={callContext} />
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="gallery-call-website">Не заполняйте это поле</label>
            <input
              type="text"
              id="gallery-call-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="form-consent-check">
            <input
              type="checkbox"
              id="gallery-call-consent"
              name="consent"
              value="1"
              required
            />
            <label htmlFor="gallery-call-consent">
              Согласен на обработку персональных данных и принимаю{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                политику конфиденциальности
              </Link>
              .
            </label>
          </div>
          <button type="submit" className="form-submit">
            Жду звонка
          </button>
        </LeadForm>
      </div>
    </div>
  );
}
