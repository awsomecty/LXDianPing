import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="bg-base-200 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                    <div className="card-body">
                        <h1 className="text-4xl font-bold text-center mb-8 text-base-content">关于我们</h1>

                        <div className="divider">创始人介绍</div>

                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="avatar">
                                <div className="w-24 h-24 rounded-full overflow-hidden relative">
                                    <Image
                                        src="/头像.jpg"
                                        alt="吃汤圆的头像"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="96px"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-base-content">吃汤圆</h2>
                                <p className="badge badge-primary">华南理工区块链协会会长</p>
                                <p className="text-base-content">
                                    我是吃汤圆，华南理工区块链协会会长。作为美食爱好者，我创建了良心点评平台，
                                    旨在分享独特的美食体验和良心餐厅。结合我在区块链领域的专业知识，
                                    我希望打造一个真实、透明、去中心化的美食评价平台，让每一位用户都能找到
                                    适合自己口味的餐厅。
                                </p>
                            </div>
                        </div>

                        <div className="divider">平台使命</div>

                        <div className="text-base-content mb-6">
                            <p className="mb-4">
                                良心点评致力于发掘城市中的隐藏美食宝藏，为用户提供真实可靠的餐厅评价。
                                我们相信，最好的美食体验往往存在于那些不为人知的角落。
                            </p>
                            <p>
                                在信息爆炸的时代，我们希望通过精心筛选，帮助用户发现真正高品质的餐厅，
                                同时为那些用心经营的小店主提供更多曝光的机会。
                            </p>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Link href="/">
                                <button className="btn btn-primary text-white">返回首页</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 