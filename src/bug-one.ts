import {
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  Column,
  Entity,
  createConnection,
} from "typeorm";

@Entity({ name: "posts" })
class Post {
    @PrimaryColumn({
        nullable: false,
        primary: true,
    })
    id!: number;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamptz",
    })
    createdAt!: number;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamptz",
    })

    updatedAt!: number;

    @Column({
      name: 'content',
      type: 'text'
    })
    content!: string
}


const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    url: "postgres://test:test@localhost:5432/test",
    entities: [ Post ],
  });

  console.log("[Case 1]: Does not set a default on save... (fails)")
  const postRepo = connection.getRepository(Post)
  const post = postRepo.create({
    id: 1,
    content: 'Hello!',
  })
  console.log("Saving createdAt:  ", post.createdAt)
  console.log("Saving updatedAt:  ", post.updatedAt)
  const savedPost = await postRepo.save(post)
  console.log("Saved createdAt:   ", savedPost.createdAt)
  console.log("Saved updatedAt:   ", savedPost.updatedAt)
  savedPost.content = "world"
  await delay(1000)
  const updatedPost = await postRepo.save(savedPost)
  console.log("Updated createdAt: ", updatedPost.createdAt)
  console.log("Updated updatedAt: ", updatedPost.updatedAt)

  connection.close()
}

const delay = (ms: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}


main()
