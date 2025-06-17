
# 🔄 Guia do Sistema de Auto-Refresh

## Visão Geral

O sistema de auto-refresh permite atualizar automaticamente o dashboard através de requisições HTTP. É útil para integrações com N8N, webhooks e sistemas automatizados.

## Como Funciona

### Arquivo Principal
- **Localização**: `/refresh.html`
- **Função**: Monitora e executa refreshs automáticos
- **Acesso**: `https://seu-dominio.com/refresh.html`

### Métodos de Ativação

#### 1. Via Parâmetros URL (Recomendado)
```
GET https://seu-dominio.com/refresh.html?refresh=true&delay=5000&url=https://seu-dominio.com
```

**Parâmetros disponíveis:**
- `refresh=true` - Ativa o sistema de refresh
- `delay=5000` - Delay em milissegundos antes do refresh (padrão: 3000)
- `target=_parent` - Onde abrir a nova página (_self, _parent, _blank)
- `url=https://...` - URL de destino (padrão: origem atual)

#### 2. Via JavaScript (Programático)
```javascript
// No console do navegador ou via script
window.refreshPage({
  delay: 5000,
  target: '_parent',
  url: 'https://seu-dashboard.com'
});
```

## Integração com N8N

### Workflow Básico

1. **HTTP Request Node**
   ```
   Method: GET
   URL: https://seu-dominio.com/refresh.html?refresh=true&delay=3000
   ```

2. **Conditional Logic** (opcional)
   - Verificar condições antes do refresh
   - Logs e notificações

### Exemplo de Workflow N8N

```json
{
  "nodes": [
    {
      "name": "Trigger Refresh",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://seu-dominio.com/refresh.html",
        "qs": {
          "refresh": "true",
          "delay": "5000",
          "url": "https://seu-dashboard.com"
        }
      }
    }
  ]
}
```

## Casos de Uso

### 1. Refresh Após Atualização de Dados
```javascript
// Após atualizar Google Sheets
fetch('https://seu-dominio.com/refresh.html?refresh=true&delay=2000');
```

### 2. Refresh Programado
```javascript
// A cada 30 minutos
setInterval(() => {
  fetch('https://seu-dominio.com/refresh.html?refresh=true');
}, 30 * 60 * 1000);
```

### 3. Refresh Condicional
```javascript
// Só refresh se há novos dados
if (hasNewData) {
  fetch('https://seu-dominio.com/refresh.html?refresh=true&delay=1000');
}
```

## Monitoramento e Logs

### Interface Visual
- Status em tempo real
- Logs de atividade
- Informações de configuração
- Histórico de refreshs

### Logs Disponíveis
- ✅ Sistema inicializado
- 🔄 Refresh solicitado
- ➡️ Redirecionamento executado
- ❌ Erros e falhas

## Configurações Avançadas

### Refresh em Iframe
```html
<iframe src="https://seu-dominio.com/refresh.html?refresh=true&target=_parent"></iframe>
```

### Refresh com Callback
```javascript
window.addEventListener('beforeunload', () => {
  // Executar ações antes do refresh
  console.log('Página será atualizada...');
});
```

## Boas Práticas

### ✅ Recomendações
- Use delays apropriados (mínimo 1000ms)
- Implemente fallbacks para erros
- Monitore logs regularmente
- Teste em ambiente de desenvolvimento

### ❌ Evitar
- Refreshs muito frequentes (< 1s)
- Loops infinitos de refresh
- Refresh sem verificação de condições
- URLs malformadas

## Troubleshooting

### Problemas Comuns

1. **Refresh não executa**
   - Verificar parâmetros URL
   - Checar conectividade
   - Validar logs no console

2. **Delay não respeitado**
   - Parâmetro delay deve ser numérico
   - Valor mínimo: 1000ms
   - Verificar formato da URL

3. **Target não funciona**
   - Verificar contexto (iframe vs. janela)
   - Usar _parent para iframes
   - Testar diferentes targets

### Debug
```javascript
// Habilitar logs detalhados
localStorage.setItem('refresh-debug', 'true');

// Verificar status
console.log('Refresh status:', window.location.search);
```

## Integração com Outros Sistemas

### Zapier
```javascript
// Webhook Zapier -> N8N -> Refresh
const zapierWebhook = 'https://hooks.zapier.com/...';
const refreshUrl = 'https://seu-dominio.com/refresh.html?refresh=true';

// No Zapier Code step
fetch(refreshUrl);
```

### Google Apps Script
```javascript
function triggerDashboardRefresh() {
  const url = 'https://seu-dominio.com/refresh.html?refresh=true&delay=3000';
  UrlFetchApp.fetch(url);
}
```

### Bash/Shell Script
```bash
#!/bin/bash
# Script para refresh via cron
curl "https://seu-dominio.com/refresh.html?refresh=true&delay=5000"
```

## Segurança

### Considerações
- Use HTTPS sempre
- Valide parâmetros de entrada
- Implemente rate limiting se necessário
- Monitore logs de acesso

### Rate Limiting (opcional)
```javascript
// Limitar refreshs por IP/tempo
const lastRefresh = localStorage.getItem('lastRefresh');
const now = Date.now();
if (now - lastRefresh < 60000) { // 1 minuto
  console.log('Refresh muito recente, aguarde...');
  return;
}
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs na interface `/refresh.html`
2. Consultar console do navegador
3. Testar parâmetros manualmente
4. Revisar este guia

**Versão**: 1.0
**Última atualização**: 2024-06-17
