const { Router } = require('express');
const controller = require('../controllers/AutorController');
const { autenticarToken, exigirRole } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @openapi
 * /api/v1/autores:
 *   get:
 *     tags: [Autores]
 *     summary: Lista todos os autores
 *     description: Rota pública, não precisa de token.
 *     responses:
 *       200:
 *         description: Lista de autores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autor'
 */
router.get('/', (req, res, next) => controller.index(req, res, next));

/**
 * @openapi
 * /api/v1/autores:
 *   post:
 *     tags: [Autores]
 *     summary: Cadastra um autor (somente ADMIN)
 *     description: Exige token JWT de um usuário com perfil ADMIN. O campo nacionalidade é opcional.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutorRequest'
 *     responses:
 *       201:
 *         description: Autor criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: Nome do autor ausente ou vazio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "O nome do autor é obrigatório."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/', autenticarToken, exigirRole('ADMIN'), (req, res, next) => controller.store(req, res, next));

module.exports = router;
