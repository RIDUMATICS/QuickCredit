import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';

import User from '../src/models/User';
import app from '../src/app';
import { userDB } from './mock-data';

chai.use(chaiHttp);

const { expect } = chai;
const baseURI = '/api/v1';
const Debug = debug('test_ENV');

describe('routes /, /404, /api/v1', () => {
  it('should return the index page', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return the API page', (done) => {
    chai
      .request(app)
      .get(baseURI)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error for any invalid route', (done) => {
    chai
      .request(app)
      .get('/404')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        done(err);
      });
  });
});

describe('routes: /auth', () => {
  context('POST /auth/signup', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      address: '12 Iyana Ipaja, CMS',
      password: 'secret',
    };

    it('should create a new user', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstName');
          expect(res.body.data).to.have.property('lastName');
          expect(res.body.data).to.have.property('email');
          done(err);
        });
    });

    specify('error when user signs up with empty last name', (done) => {
      userData.lastName = '';
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal(
            'You need to include a valid last name',
          );
          done(err);
        });
    });

    specify('error when user signs up with empty first name', (done) => {
      userData.firstName = '';
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal(
            'You need to include a valid first name',
          );
          done(err);
        });
    });

    specify('error when user signs up with empty address', (done) => {
      userData.address = '';
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty email', (done) => {
      userData.email = '';
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error when user signs up with empty password', (done) => {
      userData.password = '';
      chai
        .request(app)
        .post(`${baseURI}/auth/signup`)
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context('POST /auth/signin', () => {
    beforeEach((done) => {
      User.resetTable();
      userDB.forEach(data => User.create(data));
      done();
    });


    it('should login user if details are valid', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signin`)
        .send({
          email: 'etasseler0@is.gd',
          password: 'secret',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.property('token');
          done(err);
        });
    });

    specify('error if email is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signin`)
        .send({ email: '', password: '1234345' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if invalid email type is provided', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signin`)
        .send({ email: 'sffet', password: '1234345' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if password is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signin`)
        .send({ email: 'meetdesmond.edem@gmail.com', password: '' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if user does not exist', (done) => {
      chai
        .request(app)
        .post(`${baseURI}/auth/signin`)
        .send({ email: 'randomuser200@email.com', password: '2232323' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});

describe('routes: /users', () => {
  let token;
  beforeEach((done) => {
    User.resetTable();
    userDB.forEach(data => User.create(data));

    const user = User.table[0];
    chai
      .request(app)
      .post(`${baseURI}/auth/signin`)
      .send({
        email: user.email,
        password: 'secret',
      })
      .end((err, res) => {
        const response = res.body.data.token;
        token = response;
        done(err);
      });
  });

  context('GET /users', () => {
    it('should fetch a list of all users', (done) => {
      chai
        .request(app)
        .get(`${baseURI}/users`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          done(err);
        });
    });
  });

  context('GET /users/:user-email', () => {
    it('should fetch a specific user', (done) => {
      const user = User.table[1];
      const { email } = user;

      chai
        .request(app)
        .get(`${baseURI}/users/${email}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstName');
          expect(res.body.data).to.have.property('lastName');
          expect(res.body.data).to.have.property('address');
          expect(res.body.data).to.have.property('email');
          expect(res.body.data).to.have.property('status');
          expect(res.body.data).to.have.property('isAdmin');
          done(err);
        });
    });

    specify('error for non-existing resource', (done) => {
      const id = 20;

      chai
        .request(app)
        .get(`${baseURI}/users/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  context.skip('PATCH /users/:user-email', () => {
    const data = {
      status: 'verified',
    };

    it('should edit the status of a user (mark user as verified)', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/meetdesmond.edem@gmail.com/verify`)
        .send(data)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('status');
          done(err);
        });
    });

    specify('error if user record does not exist', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/etasseler0@is.com/verify`)
        .send(data)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    specify('error if record supplied is invalid', (done) => {
      chai
        .request(app)
        .patch(`${baseURI}/users/etasseler/verify`)
        .send(data)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
