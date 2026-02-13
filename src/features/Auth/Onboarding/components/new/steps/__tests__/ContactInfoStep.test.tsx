// @ts-nocheck
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { ContactInfoStep } from "../ContactInfoStep";

// Wrapper para simular comportamento controlado
const ContactInfoStepWrapper = ({
  initialPhone = "",
  initialInstagram = "",
  initialWebsite = "",
}: {
  initialPhone?: string;
  initialInstagram?: string;
  initialWebsite?: string;
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [website, setWebsite] = useState(initialWebsite);

  return (
    <ContactInfoStep
      phone={phone}
      instagram={instagram}
      website={website}
      onPhoneChange={setPhone}
      onInstagramChange={setInstagram}
      onWebsiteChange={setWebsite}
      onNext={vi.fn()}
      onBack={vi.fn()}
      stepNumber={3}
    />
  );
};

describe("ContactInfoStep", () => {
  describe("Validação do Instagram", () => {
    it("deve aceitar Instagram válido com letras, números, _ e .", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "user_name.123");

      // Não deve mostrar erro
      expect(screen.queryByText(/Use apenas letras/)).not.toBeInTheDocument();
    });

    it("deve mostrar erro para Instagram com caracteres inválidos (hífen)", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "user-name");

      // Deve mostrar erro
      expect(
        screen.getByText("Use apenas letras, números, _ e . (máx 30 caracteres)")
      ).toBeInTheDocument();
    });

    it("deve remover @ do início se usuário digitar", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "@username");

      // O valor exibido deve ser sem @
      expect(instagramInput).toHaveValue("username");
    });

    it("deve mostrar erro para Instagram com mais de 30 caracteres", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "a".repeat(31));

      // Deve mostrar erro
      expect(
        screen.getByText("Use apenas letras, números, _ e . (máx 30 caracteres)")
      ).toBeInTheDocument();
    });

    it("não deve mostrar erro para Instagram vazio (campo opcional)", () => {
      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      // Campo está vazio por padrão, não deve ter erro
      expect(screen.queryByText(/Use apenas letras/)).not.toBeInTheDocument();
    });
  });

  describe("Validação do Website", () => {
    it("deve aceitar URL válida com https", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const websiteInput = screen.getByPlaceholderText(
        "https://www.seunegocio.com"
      );
      await user.type(websiteInput, "https://meusite.com");

      // Não deve mostrar erro
      expect(screen.queryByText(/URL inválida/)).not.toBeInTheDocument();
    });

    it("deve aceitar URL válida sem protocolo (adiciona https automaticamente)", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const websiteInput = screen.getByPlaceholderText(
        "https://www.seunegocio.com"
      );
      await user.type(websiteInput, "meusite.com.br");

      // Não deve mostrar erro
      expect(screen.queryByText(/URL inválida/)).not.toBeInTheDocument();
    });

    it("deve mostrar erro para URL com espaços", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const websiteInput = screen.getByPlaceholderText(
        "https://www.seunegocio.com"
      );
      await user.type(websiteInput, "meu site");

      // Deve mostrar erro
      expect(
        screen.getByText("URL não pode conter espaços")
      ).toBeInTheDocument();
    });

    it("não deve mostrar erro para Website vazio (campo opcional)", () => {
      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      // Campo está vazio por padrão, não deve ter erro
      expect(screen.queryByText(/URL inválida/)).not.toBeInTheDocument();
    });
  });

  describe("Botão Continuar", () => {
    it("deve estar desabilitado quando telefone está vazio", () => {
      render(<ContactInfoStepWrapper initialPhone="" />);

      const nextButton = screen.getByRole("button", { name: /continuar/i });
      expect(nextButton).toBeDisabled();
    });

    it("deve estar desabilitado quando telefone tem menos de 10 dígitos", () => {
      render(<ContactInfoStepWrapper initialPhone="(11) 9999" />);

      const nextButton = screen.getByRole("button", { name: /continuar/i });
      expect(nextButton).toBeDisabled();
    });

    it("deve estar habilitado quando telefone é válido e não há erros", () => {
      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const nextButton = screen.getByRole("button", { name: /continuar/i });
      expect(nextButton).not.toBeDisabled();
    });

    it("deve estar desabilitado quando há erro no Instagram", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "user-invalid");

      const nextButton = screen.getByRole("button", { name: /continuar/i });
      expect(nextButton).toBeDisabled();
    });

    it("deve estar desabilitado quando há erro no Website", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const websiteInput = screen.getByPlaceholderText(
        "https://www.seunegocio.com"
      );
      await user.type(websiteInput, "invalid url");

      const nextButton = screen.getByRole("button", { name: /continuar/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Borda vermelha nos campos com erro", () => {
    it("deve aplicar borda vermelha no Instagram quando há erro", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const instagramInput = screen.getByPlaceholderText("seu_usuario");
      await user.type(instagramInput, "user-invalid");

      expect(instagramInput).toHaveClass("border-red-500");
    });

    it("deve aplicar borda vermelha no Website quando há erro", async () => {
      const user = userEvent.setup();

      render(<ContactInfoStepWrapper initialPhone="(11) 99999-9999" />);

      const websiteInput = screen.getByPlaceholderText(
        "https://www.seunegocio.com"
      );
      await user.type(websiteInput, "invalid url");

      expect(websiteInput).toHaveClass("border-red-500");
    });
  });
});
