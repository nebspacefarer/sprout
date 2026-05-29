import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    codeMirrorPlugin,
    DiffSourceToggleWrapper,
    diffSourcePlugin,
    directivesPlugin,
    headingsPlugin,
    InsertAdmonition,
    InsertCodeBlock,
    ListsToggle,
    linkPlugin,
    listsPlugin,
    MDXEditor,
    type MDXEditorMethods,
    quotePlugin,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";
import Card from "./Card";
import Text from "./Text";

import "@mdxeditor/editor/style.css";
import { useEffect, useRef } from "preact/hooks";

interface EditorProps extends BaseHTMLAttributes<HTMLBaseElement> {
    placeholder: string;
    editorTitle?: string;
    value: Signal<string>;
}

export default function MarkdownEditor(props: EditorProps) {
    const editorNode = useRef<MDXEditorMethods>(null);
    const oldContent = useSignal<string>("");

    useEffect(() => {
        oldContent.value = props.value.value;
    }, []);

    return (
        <div className="flex flex-col gap-xs">
            <Text className="font-bold text-sm">{props.editorTitle}</Text>

            <MDXEditor
                ref={editorNode}
                markdown={props.value.value ?? "# Hello world"}
                onChange={(v) => (props.value.value = v)}
                plugins={[
                    toolbarPlugin({
                        toolbarContents: () => (
                            <Card
                                className="border border-border bg-surface"
                                small
                            >
                                <div className="flex items-center gap-xs">
                                    <DiffSourceToggleWrapper>
                                        <BlockTypeSelect />
                                        <BoldItalicUnderlineToggles />
                                        <ListsToggle />
                                        <UndoRedo />
                                        <InsertAdmonition />
                                        <InsertCodeBlock />
                                    </DiffSourceToggleWrapper>
                                </div>
                            </Card>
                        ),
                    }),
                    linkPlugin(),
                    headingsPlugin(),
                    quotePlugin(),
                    listsPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "html" }),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            java: "Java",
                            js: "JavaScript",
                            html: "HTML",
                            css: "CSS",
                        },
                    }),
                    diffSourcePlugin({
                        viewMode: "rich-text",
                        diffMarkdown: oldContent.value,
                    }),
                    directivesPlugin({
                        directiveDescriptors: [AdmonitionDirectiveDescriptor],
                    }),
                ]}
                className="dark-theme dark-editor max-h-[400px]"
            />
        </div>
    );
}
