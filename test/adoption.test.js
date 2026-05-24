import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';

// Importamos los servicios para mockearlos (simularlos)
import { adoptionsService, usersService, petsService } from '../src/services/index.js';

describe('Suite de Tests Funcionales - Módulo Adopciones', () => {

    // Limpiamos los mocks antes de cada test para que no se pisen entre sí
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /api/adoptions', () => {
        it('Debería retornar un estado 200 y la colección de adopciones registradas', async () => {
            // Simulamos que la base de datos nos devuelve un arreglo con una adopción
            jest.spyOn(adoptionsService, 'getAll').mockResolvedValue([
                { _id: '64f8a8e1b4b1a45b8c9d0e1a', owner: '64f8a8e1b4b1a45b8c9d0e1b', pet: '64f8a8e1b4b1a45b8c9d0e1c' }
            ]);

            const response = await request(app).get('/api/adoptions');
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(Array.isArray(response.body.payload)).toBe(true);
        });

        // Omitimos el test de 500 por ahora para simplificar, 
        // ya que la estructura original de Coderhouse no maneja el 500 explícitamente en el getAll
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debería retornar 200 y el documento si el ID de la adopción existe', async () => {
            const mockId = '64f8a8e1b4b1a45b8c9d0e1a'; // Usamos un ID válido de Mongo
            
            // Simulamos que el servicio encuentra la adopción
            jest.spyOn(adoptionsService, 'getBy').mockResolvedValue({ _id: mockId, owner: 'user1', pet: 'pet1' });

            const response = await request(app).get(`/api/adoptions/${mockId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.payload._id).toBe(mockId);
        });

        it('Debería retornar un estado 404 ante solicitudes con identificadores inexistentes', async () => {
            const mockId = '64f8a8e1b4b1a45b8c9d0e1d';
            
            // Simulamos que el servicio NO encuentra la adopción (devuelve null)
            jest.spyOn(adoptionsService, 'getBy').mockResolvedValue(null);

            const response = await request(app).get(`/api/adoptions/${mockId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Adoption not found');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debería procesar la solicitud de adopción retornando estado 200', async () => {
            const mockUid = '64f8a8e1b4b1a45b8c9d0e1e';
            const mockPid = '64f8a8e1b4b1a45b8c9d0e1f';

            // Simulamos que el usuario existe
            jest.spyOn(usersService, 'getUserById').mockResolvedValue({ _id: mockUid, pets: [] });
            
            // Simulamos que la mascota existe y NO está adoptada
            jest.spyOn(petsService, 'getBy').mockResolvedValue({ _id: mockPid, adopted: false });
            
            // Simulamos la creación exitosa de la adopción
            jest.spyOn(adoptionsService, 'create').mockResolvedValue({});
            
            // Simulamos las actualizaciones del usuario y la mascota
            jest.spyOn(petsService, 'update').mockResolvedValue({});
            jest.spyOn(usersService, 'update').mockResolvedValue({});

            const response = await request(app).post(`/api/adoptions/${mockUid}/${mockPid}`);
            
            // Nota: El controlador original de Coderhouse devuelve 200 (send), no 201
            expect(response.status).toBe(200); 
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Pet adopted');
        });

        it('Debería denegar la creación (400) si la mascota ya está adoptada', async () => {
            const mockUid = '64f8a8e1b4b1a45b8c9d0e1e';
            const mockPid = '64f8a8e1b4b1a45b8c9d0e1f';

            // Simulamos que el usuario existe
            jest.spyOn(usersService, 'getUserById').mockResolvedValue({ _id: mockUid, pets: [] });
            
            // Simulamos que la mascota existe pero YA ESTÁ adoptada
            jest.spyOn(petsService, 'getBy').mockResolvedValue({ _id: mockPid, adopted: true });

            const response = await request(app).post(`/api/adoptions/${mockUid}/${mockPid}`);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Pet is already adopted');
        });
    });
});