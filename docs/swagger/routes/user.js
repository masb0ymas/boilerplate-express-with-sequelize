/**
 * @swagger
 *
 * /user:
 *   get:
 *     tags: ['User']
 *     summary: Get All User
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/filtered'
 *       - $ref: '#/components/parameters/sorted'
 *     responses:
 *       200:
 *          description: Get All Data From User
 */

/**
 * @swagger
 *
 * /user/{id}:
 *   get:
 *     tags: ['User']
 *     summary: Get All User By Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Get All One From User
 */

/**
 * @swagger
 *
 * /user:
 *   post:
 *     tags: ['User']
 *     summary: Create new Data to User
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: fullName
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: newPassword
 *         in: formData
 *         required: true
 *         type: string
 *       - name: confirmNewPassword
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         in: formData
 *         required: true
 *         type: string
 *       - name: RoleId
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Create new Data to User
 */

/**
 * @swagger
 *
 * /user/{id}:
 *   put:
 *     tags: ['User']
 *     summary: Update Data User
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: fullName
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: newPassword
 *         in: formData
 *         required: true
 *         type: string
 *       - name: confirmNewPassword
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         in: formData
 *         required: true
 *         type: string
 *       - name: RoleId
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Update Data User
 */

/**
 * @swagger
 *
 * /user/{id}:
 *   delete:
 *     tags: ['User']
 *     summary: Delete Data User
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *          description: Delete Data User
 */
