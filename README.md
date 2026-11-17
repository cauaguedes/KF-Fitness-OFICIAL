# KF FITNESS — Loja virtual (protótipo funcional)

Projeto inicial da loja KF FITNESS com identidade preto, cinza e dourado, vitrine responsiva, filtros por categoria, sacola, cadastro/login demonstrativos e painel local de administração.

## Abrir para visualizar

Basta abrir `index.html` em um navegador. Para desenvolvimento local, também pode usar uma extensão de servidor estático (por exemplo, Live Server no VS Code).

## Acesso demonstrativo do criador

- E-mail: `criador@kffitness.local`
- Senha: `kf-demo-2026`

**Atenção:** este acesso é apenas para testar a interface localmente. Os dados ficam no `localStorage` do navegador. Não publique esta versão como loja real e não reutilize essas credenciais. O login demonstrativo de cliente também não é autenticação segura.

## O que já funciona no protótipo

- Vitrine adaptável a celular e computador.
- Filtros de produtos por categoria.
- Sacola com quantidade, remoção e subtotal.
- Cadastro/login de cliente local para demonstração.
- Painel demonstrativo do criador com cadastro, edição e exclusão de produtos.
- Identidade visual KF em preto, cinza e dourado.

## O que precisa ser integrado antes de vender de verdade

1. **Firebase Authentication:** cadastro/login real de clientes, recuperação de senha e sessão segura.
2. **Permissão de administrador:** criar o primeiro administrador por processo confiável no servidor (Firebase Admin SDK / custom claims). Nunca permitir que o navegador escolha ou altere a própria função. Proteger todas as rotas e operações administrativas no backend.
3. **Cloud Firestore:** catálogo, clientes, pedidos, estoque e status de entrega.
4. **Firebase Storage:** upload e armazenamento de imagens dos produtos.
5. **Mercado Pago:** checkout Pix/cartão criado no servidor com credenciais privadas em variáveis de ambiente; confirmar pagamentos por webhook validado. Nunca colocar Access Token no JavaScript do navegador.
6. **Frete:** integrar cálculo/etiquetas dos Correios ou um intermediador de frete; configurar entrega local e retirada com regras e áreas atendidas.
7. **Publicação:** domínio, hospedagem, HTTPS, política de privacidade, termos, política de troca/devolução e configuração LGPD.

## Configuração de produção sugerida

- Frontend: React + Vite (ou Next.js).
- Autenticação e dados: Firebase Authentication + Firestore.
- Imagens: Firebase Storage.
- Backend: Firebase Cloud Functions ou servidor Node.js.
- Pagamento: Mercado Pago Checkout Pro/Bricks, com criação de preferência no servidor e webhook.

### Regras essenciais de segurança

- Cliente pode ler catálogo publicado e consultar apenas o próprio perfil/pedidos.
- Cliente nunca pode escrever `role: admin` ou alterar permissões.
- Somente custom claim `admin=true`, atribuída pelo servidor, pode administrar produtos, estoque e pedidos.
- Preços e totais devem ser recalculados no backend, nunca confiados ao navegador.
- Só marcar pedido como pago após confirmação autenticada do provedor de pagamento.

Este pacote é uma base demonstrativa pronta para avaliação visual e testes locais, não uma loja já conectada a serviços de produção.
