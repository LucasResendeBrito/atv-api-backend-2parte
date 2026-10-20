// Colocar este arquivo em config/swagger.js
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Livraria API',
      version: '1.0.0',
      description:
        'API de Livros e Autores com autenticação JWT e controle de acesso por perfil (USER e ADMIN).\n\n' +
        'Como testar rotas protegidas: faça login em POST /api/v1/auth/login, copie o campo "token" da resposta, ' +
        'clique em "Authorize" aqui em cima e cole só o token (sem escrever "Bearer").'
    },
    servers: [{ url: '/', description: 'Servidor atual' }],
    tags: [
      { name: 'Auth', description: 'Cadastro e login' },
      { name: 'Livros', description: 'Consulta e cadastro de livros e comentários' },
      { name: 'Autores', description: 'Consulta e cadastro de autores' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login'
        }
      },
      schemas: {
        Erro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Mensagem descrevendo o erro.' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Lucas Resende' },
            email: { type: 'string', format: 'email', example: 'lucas@email.com' },
            senha: { type: 'string', format: 'password', example: 'senha123' },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              default: 'USER',
              description: 'Opcional. Se não enviar, o usuário é criado como USER.',
              example: 'USER'
            }
          }
        },
        UsuarioResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1760900000000 },
            nome: { type: 'string', example: 'Lucas Resende' },
            email: { type: 'string', example: 'lucas@email.com' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'lucas@email.com' },
            senha: { type: 'string', format: 'password', example: 'senha123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1760900000000 },
                nome: { type: 'string', example: 'Lucas Resende' },
                role: { type: 'string', example: 'USER' }
              }
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVIifQ.assinatura'
            }
          }
        },
        Comentario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            autor_nome: { type: 'string', example: 'Leitor' },
            texto: { type: 'string', example: 'Clássico indispensável.' }
          }
        },
        ComentarioRequest: {
          type: 'object',
          required: ['texto'],
          properties: {
            texto: { type: 'string', example: 'Li em uma semana, recomendo muito.' }
          }
        },
        Livro: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Dom Casmurro' },
            ano: { type: 'integer', example: 1899 },
            autor_id: { type: 'integer', example: 1 },
            autor_nome: { type: 'string', example: 'Machado de Assis' },
            comentarios: { type: 'array', items: { $ref: '#/components/schemas/Comentario' } }
          }
        },
        LivroRequest: {
          type: 'object',
          required: ['titulo', 'autor_id'],
          properties: {
            titulo: { type: 'string', example: 'Memórias Póstumas de Brás Cubas' },
            ano: { type: 'integer', description: 'Opcional. Padrão é o ano atual.', example: 1881 },
            autor_id: { type: 'integer', example: 1 }
          }
        },
        Autor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Machado de Assis' },
            nacionalidade: { type: 'string', example: 'Brasileiro' }
          }
        },
        AutorRequest: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Clarice Lispector' },
            nacionalidade: { type: 'string', example: 'Brasileira' }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Token ausente, inválido, expirado ou corrompido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              examples: {
                semToken: { summary: 'Sem token', value: { erro: 'Token de autenticação não fornecido.' } },
                invalido: { summary: 'Token inválido ou expirado', value: { erro: 'Token inválido ou expirado.' } }
              }
            }
          }
        },
        Forbidden: {
          description: 'Usuário autenticado sem perfil ADMIN',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'Acesso proibido: privilégio de ADMIN exigido.' }
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

module.exports = swaggerJsdoc(options);
