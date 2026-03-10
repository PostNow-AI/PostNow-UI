export default function PrivacyPolicyPage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: 800, margin: "0 auto", padding: "48px 24px", color: "#1a1a1a", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Política de Privacidade</h1>
      <p style={{ color: "#666", marginBottom: 40 }}>Última atualização: março de 2026</p>

      <p>A <strong>PostNow</strong> ("nós", "nosso" ou "empresa") está comprometida com a proteção da sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma em <a href="https://app.postnow.com.br" style={{ color: "#7c3aed" }}>app.postnow.com.br</a>.</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>1. Informações que Coletamos</h2>
      <p>Coletamos as seguintes categorias de informações:</p>
      <ul>
        <li><strong>Dados de conta:</strong> nome, endereço de e-mail e senha ao se cadastrar.</li>
        <li><strong>Dados do Instagram:</strong> quando você conecta sua conta do Instagram, coletamos seu nome de usuário, ID de usuário, token de acesso e métricas de engajamento (curtidas, comentários, alcance).</li>
        <li><strong>Conteúdo gerado:</strong> textos, imagens e posts criados na plataforma.</li>
        <li><strong>Dados de uso:</strong> registros de acesso, endereço IP e informações do dispositivo para fins de segurança e melhoria do serviço.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>2. Como Usamos suas Informações</h2>
      <ul>
        <li>Fornecer e melhorar os serviços da PostNow.</li>
        <li>Publicar conteúdo no Instagram em seu nome, mediante sua autorização.</li>
        <li>Enviar notificações e relatórios sobre o desempenho do seu conteúdo.</li>
        <li>Cumprir obrigações legais e regulatórias.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>3. Dados do Instagram</h2>
      <p>Ao conectar sua conta do Instagram Business à PostNow, você autoriza expressamente o acesso às seguintes permissões:</p>
      <ul>
        <li><strong>instagram_business_basic:</strong> leitura de dados básicos do perfil.</li>
        <li><strong>instagram_business_content_publish:</strong> publicação de posts em seu nome.</li>
        <li><strong>instagram_business_manage_comments:</strong> leitura de comentários para monitoramento de engajamento.</li>
        <li><strong>instagram_business_manage_messages:</strong> recebimento de mensagens diretas via webhook.</li>
        <li><strong>instagram_business_manage_insights:</strong> acesso a métricas de desempenho.</li>
      </ul>
      <p>Não compartilhamos seus dados do Instagram com terceiros, exceto quando exigido por lei.</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>4. Compartilhamento de Dados</h2>
      <p>Não vendemos suas informações pessoais. Podemos compartilhar dados com:</p>
      <ul>
        <li><strong>Provedores de serviço:</strong> Google (autenticação), Stripe (pagamentos), AWS (armazenamento), OpenAI e Google Gemini (geração de conteúdo por IA).</li>
        <li><strong>Meta/Instagram:</strong> exclusivamente para executar as ações autorizadas por você.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>5. Segurança</h2>
      <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia de tokens de acesso e comunicação via HTTPS.</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>6. Seus Direitos (LGPD)</h2>
      <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de:</p>
      <ul>
        <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
        <li>Revogar o consentimento a qualquer momento.</li>
        <li>Solicitar a portabilidade dos seus dados.</li>
      </ul>
      <p>Para exercer esses direitos, entre em contato: <a href="mailto:privacidade@postnow.com.br" style={{ color: "#7c3aed" }}>privacidade@postnow.com.br</a></p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>7. Exclusão de Dados</h2>
      <p>Para solicitar a exclusão de seus dados, acesse as configurações da sua conta ou envie um e-mail para <a href="mailto:privacidade@postnow.com.br" style={{ color: "#7c3aed" }}>privacidade@postnow.com.br</a>. Processaremos sua solicitação em até 15 dias úteis.</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 40, marginBottom: 12 }}>8. Contato</h2>
      <p>PostNow — Go Evento Sistema de Integração Digital Ltda<br />
      E-mail: <a href="mailto:privacidade@postnow.com.br" style={{ color: "#7c3aed" }}>privacidade@postnow.com.br</a><br />
      Site: <a href="https://app.postnow.com.br" style={{ color: "#7c3aed" }}>app.postnow.com.br</a></p>

      <p style={{ marginTop: 48, color: "#999", fontSize: 14 }}>© 2026 PostNow. Todos os direitos reservados.</p>
    </div>
  );
}
