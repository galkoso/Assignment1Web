import { Types } from 'mongoose';

export const mockPost = {
    title: 'Test Post',
    content: 'Test content',
    author: 'Test Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostData = {
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'Test Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostDataWithoutPublishDate = {
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'Test Author'
};

export const mockPostWithoutTitle = {
    content: 'This is a test post content',
    author: 'Test Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithoutContent = {
    title: 'Test Post',
    author: 'Test Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithoutAuthor = {
    title: 'Test Post',
    content: 'This is a test post content',
    publishDate: new Date('2024-01-15')
};

export const mockPostOriginal = {
    title: 'Original Title',
    content: 'Original content',
    author: 'Original Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostUpdated = {
    title: 'Updated Title',
    content: 'Updated content',
    author: 'Updated Author',
    publishDate: new Date('2024-01-20')
};

export const mockPostUpdatedPartial = {
    title: 'Updated Title',
    content: 'Updated content',
    author: 'Original Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostUpdatedTitleOnly = {
    title: 'Updated Title'
};

export const mockPostComplete = {
    title: 'Complete Post',
    content: 'Complete content',
    author: 'Complete Author',
    publishDate: new Date('2024-01-15')
};

export const mockPostByJohn = {
    title: 'Post by John',
    content: 'Content by John',
    author: 'John Doe',
    publishDate: new Date('2024-01-15')
};

export const mockPostByJane = {
    title: 'Post by Jane',
    content: 'Content by Jane',
    author: 'Jane Doe',
    publishDate: new Date('2024-01-16')
};

export const mockPostAnotherByJohn = {
    title: 'Another Post by John',
    content: 'Another content by John',
    author: 'John Doe',
    publishDate: new Date('2024-01-17')
};

export const mockPostOlderByJohn = {
    title: 'Older Post by John',
    content: 'Older content',
    author: 'John Doe',
    publishDate: new Date('2024-01-10')
};

export const mockPostNewerByJohn = {
    title: 'Newer Post by John',
    content: 'Newer content',
    author: 'John Doe',
    publishDate: new Date('2024-01-20')
};

export const mockPostWithSpaces = {
    title: 'Post by Author with Spaces',
    content: 'Content',
    author: 'Author with Spaces',
    publishDate: new Date('2024-01-15')
};

export const mockPostWithId = {
    _id: new Types.ObjectId(),
    ...mockPost
};

export const mockPostMultiple = [
    {
        title: 'Post 1',
        content: 'Content 1',
        author: 'Author 1',
        publishDate: new Date('2024-01-15')
    },
    {
        title: 'Post 2',
        content: 'Content 2',
        author: 'Author 2',
        publishDate: new Date('2024-01-16')
    }
];

export const mockPostOlder = {
    title: 'Older Post',
    content: 'Older content',
    author: 'Author 1',
    publishDate: new Date('2024-01-10')
};

export const mockPostNewer = {
    title: 'Newer Post',
    content: 'Newer content',
    author: 'Author 2',
    publishDate: new Date('2024-01-20')
};

export const mockComment = {
    owner: 'Comment Owner',
    postId: new Types.ObjectId(),
    content: 'This is a test comment'
};

export const mockCommentWithId = {
    _id: new Types.ObjectId(),
    ...mockComment
};

export const mockCommentData = {
    owner: 'Comment Owner',
    postId: new Types.ObjectId().toString(),
    content: 'This is a test comment'
};

export const mockCommentOriginal = {
    owner: 'Comment Owner',
    postId: new Types.ObjectId(),
    content: 'Original content'
};

export const mockCommentUpdated = {
    content: 'Updated content'
};

export const mockCommentUpdatedWithSpaces = {
    content: '  Updated content with spaces  '
};

export const mockCommentMultiple = [
    {
        owner: 'Owner 1',
        postId: new Types.ObjectId(),
        content: 'First comment'
    },
    {
        owner: 'Owner 2',
        postId: new Types.ObjectId(),
        content: 'Second comment'
    }
];

export const mockCommentOlder = {
    owner: 'Owner 1',
    postId: new Types.ObjectId(),
    content: 'Older comment',
    createdAt: new Date('2024-01-10')
};

export const mockCommentNewer = {
    owner: 'Owner 2',
    postId: new Types.ObjectId(),
    content: 'Newer comment',
    createdAt: new Date('2024-01-20')
};

export const mockCommentForPost1 = {
    owner: 'Owner 1',
    postId: new Types.ObjectId(),
    content: 'Comment for post 1'
};

export const mockCommentForPost2 = {
    owner: 'Owner 2',
    postId: new Types.ObjectId(),
    content: 'Comment for post 2'
};

export const mockCommentToDelete = {
    owner: 'Comment Owner',
    postId: new Types.ObjectId(),
    content: 'Comment to delete'
};

export const mockComment1 = {
    owner: 'Owner 1',
    postId: new Types.ObjectId(),
    content: 'Comment 1'
};

export const mockComment2 = {
    owner: 'Owner 2',
    postId: new Types.ObjectId(),
    content: 'Comment 2'
};

export const mockInvalidPostId = '507f1f77bcf86cd799439011';
export const mockInvalidCommentId = '507f1f77bcf86cd799439011';

export const mockCommentWithoutOwner = {
    postId: new Types.ObjectId().toString(),
    content: 'This is a test comment'
};

export const mockCommentWithoutPostId = {
    owner: 'Comment Owner',
    content: 'This is a test comment'
};

export const mockCommentWithoutContent = {
    owner: 'Comment Owner',
    postId: new Types.ObjectId().toString()
};

export const mockUpdateCommentWithoutContent = {};
