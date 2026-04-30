const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 1. Busca o token no cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    
    // O cabeçalho vem no formato: "Bearer TOKEN_AQUI"
    // O split separa pelo espaço e o [1] pega só o código do token
    const token = authHeader && authHeader.split(' ')[1];

    // Se não houver token, retorna erro 401 (Não autorizado)
    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Faça login para continuar." });
    }

    try {
        // 2. Verifica se o token é legítimo usando a nossa SECRET do .env
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Colocamos os dados do usuário (ID e Role) dentro da requisição
        // Assim, qualquer controller pra frente saberá QUEM está logado
        req.user = verified;
        
        // 4. Libera a passagem para o próximo passo (Controller)
        next();
    } catch (error) {
        // Se o token for falso ou tiver expirado, retorna 403 (Proibido)
        res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

module.exports = authenticateToken;