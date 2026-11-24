import type { RefObject } from "react";
import Link from "next/link";
import { Button, Checkbox, Input } from "@/shared/ui";
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
        <Button
          unstyled
          type="button"
          className="modal-close"
          aria-label="Закрыть"
          data-autofocus
          onClick={closeCall}
        >
          ×
        </Button>
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
            <Input
              unstyled
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
            <Input
              unstyled
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
            <Input
              unstyled
              type="text"
              id="gallery-call-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <Checkbox
            id="gallery-call-consent"
            name="consent"
            value="1"
            required
            className="form-consent-check"
          >
            Согласен на обработку персональных данных и принимаю{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              политику конфиденциальности
            </Link>
            .
          </Checkbox>
          <Button unstyled type="submit" className="form-submit">
            Жду звонка
          </Button>
        </LeadForm>
      </div>
    </div>
  );
}
