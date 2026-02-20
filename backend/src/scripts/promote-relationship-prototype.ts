import { PrismaClient, ProjectRole, EntityType } from '@prisma/client';

const prisma = new PrismaClient();

interface RelationshipProperties {
  role?: string;
  note?: string;
  [key: string]: unknown;
}

/**
 * プロトタイプ: UserDefinedRelationship (MEMBER) -> ProjectContributor への昇格
 */
async function main() {
  try {
    console.log('Starting promotion prototype script...');

    // --- 1. デモ用データの準備 (存在しない場合のみ作成) ---
    console.log('\n--- 1. Setting up demo data ---');

    // プロジェクト作成
    const demoProject = await prisma.project.upsert({
      where: { projectNumber: 'P-DEMO-PROMOTION' },
      update: {},
      create: {
        projectNumber: 'P-DEMO-PROMOTION',
        description: 'Project for testing relationship promotion',
      },
    });
    console.log(
      `Demo Project: ${demoProject.id} (${demoProject.projectNumber})`,
    );

    // 研究者作成
    const demoContributor = await prisma.contributor.upsert({
      where: { contributorId: 'C-DEMO-MEMBER' },
      update: {},
      create: {
        contributorId: 'C-DEMO-MEMBER',
        name: 'Demo Member (ToBePromoted)',
      },
    });
    console.log(
      `Demo Contributor: ${demoContributor.id} (${demoContributor.name})`,
    );

    // UserDefinedRelationship (MEMBER) 作成
    // 既に ProjectContributor が存在しないか、かつ UserDefinedRelationship もまだ処理されていないか確認
    const existingRelation = await prisma.userDefinedRelationship.findFirst({
      where: {
        sourceId: demoProject.id,
        targetId: demoContributor.id,
        relationshipType: 'MEMBER',
        deletedAt: null,
      },
    });

    const existingProjectContributor =
      await prisma.projectContributor.findFirst({
        where: {
          projectId: demoProject.id,
          contributorId: demoContributor.id,
        },
      });

    if (!existingRelation && !existingProjectContributor) {
      await prisma.userDefinedRelationship.create({
        data: {
          relationshipType: 'MEMBER',
          sourceId: demoProject.id,
          sourceType: EntityType.PROJECT,
          targetId: demoContributor.id,
          targetType: EntityType.CONTRIBUTOR,
          properties: {
            role: 'DATA_MANAGER', // プロパティで役割を指定してみる
            note: 'Added via flexible relationship',
          },
          createdBy: 'script-demo',
        },
      });
      console.log('Created UserDefinedRelationship (MEMBER) for demo.');
    } else {
      console.log(
        'Demo relationship already exists or already promoted. Skipping creation.',
      );
    }

    // --- 2. 昇格処理 (Promotion Logic) ---
    console.log('\n--- 2. Executing Promotion Logic ---');

    // 対象の UserDefinedRelationship を検索
    const candidates = await prisma.userDefinedRelationship.findMany({
      where: {
        relationshipType: 'MEMBER',
        sourceType: EntityType.PROJECT,
        targetType: EntityType.CONTRIBUTOR,
        deletedAt: null,
      },
    });

    console.log(`Found ${candidates.length} candidates for promotion.`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const rel of candidates) {
      try {
        // トランザクションで処理
        await prisma.$transaction(async (tx) => {
          // 重複チェック
          const exists = await tx.projectContributor.findFirst({
            where: {
              projectId: rel.sourceId,
              contributorId: rel.targetId,
            },
          });

          if (exists) {
            console.log(
              `[SKIP] ProjectContributor already exists for Project:${rel.sourceId}, Contributor:${rel.targetId}`,
            );
            // 既に正規のリレーションがあるなら、UserDefinedRelationship は不要なので削除(論理削除)だけする？
            // 今回は安全のため、スキップしつつログに残すのみとする（あるいは手動確認を促す）
            // ただし、完全に重複しているなら削除しても良い。ここでは「スキップ」とし、関係を維持する。
            skipCount++;
            return;
          }

          // Role の決定
          let role: ProjectRole = ProjectRole.CO_INVESTIGATOR; // Default
          const properties = rel.properties;

          if (
            properties &&
            typeof properties === 'object' &&
            !Array.isArray(properties)
          ) {
            const props = properties as unknown as RelationshipProperties;
            if (props.role && typeof props.role === 'string') {
              // 文字列から Enum への簡易マッピング (必要に応じて厳密化)
              const roleStr = props.role;
              const roleKey = Object.keys(ProjectRole).find(
                (k) =>
                  k === roleStr ||
                  k === roleStr.toUpperCase().replace(' ', '_'),
              );
              if (roleKey) {
                role = ProjectRole[roleKey as keyof typeof ProjectRole];
              } else if (roleStr === 'Data Manager') {
                role = ProjectRole.DATA_MANAGER;
              }
            }
          }

          // ProjectContributor 作成
          await tx.projectContributor.create({
            data: {
              projectId: rel.sourceId,
              contributorId: rel.targetId,
              role: role,
            },
          });

          // UserDefinedRelationship 論理削除
          await tx.userDefinedRelationship.update({
            where: { id: rel.id },
            data: { deletedAt: new Date() },
          });

          console.log(
            `[SUCCESS] Promoted relation ${rel.id} -> ProjectContributor (Role: ${role})`,
          );
          successCount++;
        });
      } catch (e) {
        console.error(`[ERROR] Failed to promote relation ${rel.id}:`, e);
        errorCount++;
      }
    }

    console.log('\n--- 3. Summary ---');
    console.log(`Total: ${candidates.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Skipped: ${skipCount}`);
    console.log(`Errors: ${errorCount}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 呼び出し
void main();
