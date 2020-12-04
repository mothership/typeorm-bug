import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  ValueTransformer,
  createConnection,
} from "typeorm";

const unixTimestamp: ValueTransformer = {
  from: (value: Date | null | undefined): number | null | undefined => {
    return value ? value.getTime() : value
  },
  to: (value: number | null | undefined): Date | null | undefined => {
    return typeof value === 'number' ? new Date(value) : value
  },
}


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
        transformer: unixTimestamp,
    })
    createdAt!: number;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamptz",
        transformer: unixTimestamp,
    })

    updatedAt!: number;

    @Column({
      name: 'content',
      type: 'text'
    })
    content!: string
}


@Entity({ name: "posts" })
class PostNormal {
    @PrimaryColumn({
        nullable: false,
        primary: true,
    })
    id!: number;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamptz",
        nullable: false,
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamptz",
        nullable: false,
    })
    updatedAt!: Date;

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
    entities: [ Post, PostNormal ],
  });

  console.log("[Case 1]: Normal Baseline (should work)")
  const postNormalRepo = connection.getRepository(PostNormal)
  const postNormal = postNormalRepo.create({
    id: 2,
    content: 'Hello!',
  })
  console.log("Saving createdAt:  ", postNormal.createdAt)
  console.log("Saving updatedAt:  ", postNormal.updatedAt)
  const savedNormalPost = await postNormalRepo.save(postNormal)
  console.log("Saved createdAt:   ", savedNormalPost.createdAt)
  console.log("Saved updatedAt:   ", savedNormalPost.updatedAt)
  savedNormalPost.content = "world"
  await delay(1000)
  const updatedNormalPost = await postNormalRepo.save(savedNormalPost)
  console.log("Updated createdAt: ", updatedNormalPost.createdAt)
  console.log("Updated updatedAt: ", updatedNormalPost.updatedAt)

  console.log("")
  console.log("[Case 2]: With Transformer (fails)")
  const postRepo = connection.getRepository(Post)
  const post = postRepo.create({
    id: 3,
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
