const { Router } = require('express');
const controller = require('../controllers/LivroController');
const { autenticarToken, exigirRole } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @openapi
 * /api/v1/livros:
 *   get:
 *     tags: [Livros]
 *     summary: Lista todos os livros
 *     description: Rota pública. Cada livro vem com o nome do autor e seus comentários.
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "Ocorreu um erro interno no servidor."
 */
router.get('/', (req, res, next) => controller.index(req, res, next));

/**
 * @openapi
 * /api/v1/livros/{id}:
 *   get:
 *     tags: [Livros]
 *     summary: Busca um livro pelo id
 *     description: Rota pública.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Id do livro
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "Livro não localizado."
 */
router.get('/:id', (req, res, next) => controller.show(req, res, next));

/**
 * @openapi
 * /api/v1/livros:
 *   post:
 *     tags: [Livros]
 *     summary: Cadastra um livro (somente ADMIN)
 *     description: Exige token JWT de um usuário com perfil ADMIN. O autor_id precisa existir. Se o ano não for enviado, usa o ano atual.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LivroRequest'
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         description: Título ou autor_id ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "O título e o autor_id são obrigatórios."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Autor informado não existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "O autor informado não existe."
 */
router.post('/', autenticarToken, exigirRole('ADMIN'), (req, res, next) => controller.store(req, res, next));

/**
 * @openapi
 * /api/v1/livros/{id}/comentarios:
 *   post:
 *     tags: [Livros]
 *     summary: Adiciona um comentário a um livro (USER ou ADMIN)
 *     description: Exige token JWT válido de qualquer perfil. O nome do autor do comentário vem do token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Id do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComentarioRequest'
 *     responses:
 *       201:
 *         description: Comentário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: Texto do comentário vazio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "O texto do comentário não pode estar vazio."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: "Livro não localizado."
 */
router.post('/:id/comentarios', autenticarToken, (req, res, next) => controller.storeComment(req, res, next));

module.exports = router;
