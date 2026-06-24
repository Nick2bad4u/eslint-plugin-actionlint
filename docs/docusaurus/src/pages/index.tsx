import type { JSX } from "react";

import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

export default function Home(): JSX.Element {
    return (
        <Layout
            description="ESLint plugin that runs Actionlint through ESLint."
            title="eslint-plugin-actionlint"
        >
            <main className="bridgeHome">
                <section className="bridgeHome__hero">
                    <span className="bridgeHome__eyebrow">ESLint bridge</span>
                    <h1 className="bridgeHome__title">
                        eslint-plugin-actionlint
                    </h1>
                    <p className="bridgeHome__copy">
                        Run Actionlint from ESLint, surface workflow diagnostics
                        in editor and CI output, and keep Actionlint config-file
                        policy close to the rest of your lint setup.
                    </p>
                    <div className="bridgeHome__actions">
                        <Link
                            className="button button--primary"
                            to="/docs/rules/guides/intro"
                        >
                            Rule docs
                        </Link>
                        <Link className="button button--secondary" to="/docs">
                            Project docs
                        </Link>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
