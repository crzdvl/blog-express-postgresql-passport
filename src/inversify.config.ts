import { Container } from 'inversify';

import { TYPES } from './services/types';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { BaseService } from './services/base.service';
import { MailService } from './services/mail.service';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';
import { PostLikeService } from './services/postLike.service';
import { CommentLikeService } from './services/commentLike.service';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<BaseService>(TYPES.BaseService).to(BaseService);
container.bind<MailService>(TYPES.MailService).to(MailService);
container.bind<PostService>(TYPES.PostService).to(PostService);
container.bind<PostLikeService>(TYPES.PostLikeService).to(PostLikeService);
container.bind<CommentLikeService>(TYPES.CommentLikeService).to(CommentLikeService);
container.bind<CommentService>(TYPES.CommentService).to(CommentService);

export default container;
