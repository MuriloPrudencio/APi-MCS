import DatabaseError from '../model/Errors/dataBase.error';
import db from '../db';
import User from '../model/user.model';

class UserRepository {
  async findAllUsers(): Promise<User[]> {
    /*Script Sql */
    const query = `
    SELECT  uuid, username
    FROM application_user
    `;

    /*Execução do Script */
    const { rows } = await db.query<User>(query);
    return rows || [];
  }

  async findById(uuid: string): Promise<User> {
    /*Script Sql */
    try {
      const query = `
    SELECT uuid, username
    FROM application_user
    WHERE uuid = $1
`;

      /*Execução do Script */
      const values = [uuid];

      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user;
    } catch (error) {
      throw new DatabaseError('Erro na consulta por ID', error);
    }
  }

  async findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    try {
      const query = `
            SELECT uuid, username
            FROM application_user
            WHERE username = $1
            AND password = crypt($2, 'my_salt')
        `;
      const values = [username, password];
      const { rows } = await db.query<User>(query, values);
      const [user] = rows;
      return user || null;
    } catch (error) {
      throw new DatabaseError(
        'Erro na consulta por username e password',
        error,
      );
    }
  }

  async create(user: User): Promise<string> {
    /*Script Sql */
    const script = `
    INSERT INTO application_user (
      username,
      password
    )
    VALUES ($1, crypt($2, 'my_salt'))
    RETURNING uuid
    `;

    /*Execução do Script */
    const values = [user.username, user.password];

    const { rows } = await db.query<{ uuid: string }>(script, values);
    const [newUser] = rows;
    return newUser.uuid;
  }

  async update(user: User): Promise<void> {
    /*Script Sql */
    const script = `
        UPDATE application_user 
        SET 
            username = $1,
            password = crypt($2, 'my_salt')
        WHERE uuid = $3
    `;

    /*Execução do Script */
    const values = [user.username, user.password, user.uuid];
    await db.query(script, values);
  }

  async remove(uuid: string): Promise<void> {
    /*Script Sql */
    const cript = `
    DELETE
    FROM application_user
    WHERE uuid = $1
    `;

    /*Execução do Script */
    const values = [uuid];
    await db.query(cript, values);
  }
}

export default new UserRepository();
