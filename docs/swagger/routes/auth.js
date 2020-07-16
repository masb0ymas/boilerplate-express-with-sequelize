/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     tags: ['Authentication']
 *     summary: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Login
 */
