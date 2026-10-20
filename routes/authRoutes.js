const { Router } = require('express');
const controller = require('../controllers/AuthController');

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cadastra um novo usuário
 *     description: Cria um usuário com senha protegida por BCrypt. Se o campo role não for enviado, o perfil padrão é USER. A senha nunca é devolvida na resposta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Campos obrigatórios ausentes (nome, email ou senha)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "Campos obrigatórios ausentes: nome, email ou senha."
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "E-mail já cadastrado no sistema."
 */
router.post('/register', (req, res, next) => controller.register(req, res, next));

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica o usuário e retorna um token JWT
 *     description: Confere e-mail e senha. Em caso de sucesso devolve o token JWT (válido por 1 hora) que deve ser enviado no header Authorization como Bearer nas rotas protegidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: E-mail ou senha não informados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "E-mail e senha são obrigatórios."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "Credenciais inválidas."
 */
router.post('/login', (req, res, next) => controller.login(req, res, next));

module.exports = router;
