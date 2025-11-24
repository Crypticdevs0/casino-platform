import { reportError } from "@/sdk/core/internal/creao-shell";
import { AlertTriangle, Home, RefreshCw, Copy, ChevronDown } from "lucide-react";
import React, { useReducer, type JSX } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
}

type ErrorBoundaryProps = JSX.IntrinsicElements["div"] & {
	tagName: "div" | "main";
	children: React.ReactNode;
};

let normalContainer: HTMLDivElement | null = null;
let clonedStage: HTMLDivElement | null = null;

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		clonedStage = normalContainer?.cloneNode(true) as HTMLDivElement;
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({ hasError: true, error, errorInfo });
		reportError(error, {});
	}

	applyClonedContent = (target: HTMLDivElement | null) => {
		if (!clonedStage || !target) return;
		for (const node of clonedStage.childNodes) target.appendChild(node);
	};

	handleNavigateHome = () => {
		window.location.href = '/';
	};

	handleReload = () => {
		window.location.reload();
	};

	render() {
		const { tagName: Container, children, ...props } = this.props;

		if (this.state.hasError) {
			return (
				<>
					<Container
						{...props}
						ref={this.applyClonedContent}
						className={`filter brightness-75 ${props.className || ""}`}
					/>
					<ErrorMask
						error={this.state.error}
						errorInfo={this.state.errorInfo}
						onReload={this.handleReload}
						onNavigateHome={this.handleNavigateHome}
					/>
				</>
			);
		}
		return (
			<Container
				{...props}
				ref={(e) => {
					normalContainer = e;
				}}
			>
				{children}
			</Container>
		);
	}
}

function ErrorMask(props: {
	error: Error | undefined;
	errorInfo: React.ErrorInfo | undefined;
	onReload: () => void;
	onNavigateHome: () => void;
}) {
	const [isCollapsed, toggleCollapsed] = useReducer((state) => !state, false);
	const [isCopied, setIsCopied] = useReducer((state) => !state, false);

	const handleCopyError = async () => {
		const errorText = `${props.error?.message}\n\n${props.errorInfo?.componentStack}`;
		try {
			await navigator.clipboard.writeText(errorText);
			setIsCopied();
			setTimeout(() => setIsCopied(), 2000);
		} catch (err) {
			console.error('Failed to copy error', err);
		}
	};

	return (
		<>
			<AnimatePresence>
				{!isCollapsed && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed z-[10000] inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.3, type: "spring" }}
							className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-red-500/20 rounded-xl shadow-2xl overflow-hidden"
						>
							{/* Header */}
							<div className="flex items-start gap-4 p-6 border-b border-red-500/10 bg-gradient-to-r from-red-500/10 to-transparent">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/20">
										<AlertTriangle className="w-6 h-6 text-red-400" />
									</div>
								</div>
								<div className="flex-1">
									<h1 className="text-2xl font-bold text-white">
										Something went wrong
									</h1>
									<p className="text-sm text-slate-400 mt-1">
										An unexpected error occurred. Here's what happened:
									</p>
								</div>
							</div>

							{/* Error Message */}
							<div className="px-6 py-4 bg-slate-800/50 border-b border-red-500/10">
								<div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4">
									<p className="text-red-200 font-mono text-sm break-words">
										{props.error?.message || 'Unknown error'}
									</p>
								</div>
							</div>

							{/* Stack Trace */}
							<div className="flex-1 overflow-hidden">
								<div className="px-6 py-4">
									<h3 className="text-sm font-semibold text-slate-300 mb-2">
										Error Details
									</h3>
									<ScrollArea className="h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-3">
										<pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono">
											{props.errorInfo?.componentStack || props.error?.stack || 'No additional details available'}
										</pre>
									</ScrollArea>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-3 p-6 bg-slate-900/50 border-t border-slate-700 flex-wrap">
								<Button
									onClick={props.onReload}
									size="sm"
									className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
								>
									<RefreshCw className="w-4 h-4" />
									Reload Page
								</Button>
								<Button
									onClick={props.onNavigateHome}
									size="sm"
									variant="outline"
									className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2"
								>
									<Home className="w-4 h-4" />
									Go Home
								</Button>
								<Button
									onClick={handleCopyError}
									size="sm"
									variant="ghost"
									className="text-slate-400 hover:text-slate-200 gap-2"
								>
									<Copy className="w-4 h-4" />
									{isCopied ? 'Copied!' : 'Copy Error'}
								</Button>
								<Button
									onClick={toggleCollapsed}
									size="sm"
									variant="ghost"
									className="ml-auto text-slate-400 hover:text-slate-200"
								>
									<ChevronDown className="w-4 h-4" />
									Close
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Collapsed Banner */}
			<AnimatePresence>
				{isCollapsed && (
					<motion.div
						initial={{ translateY: -100, opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						exit={{ translateY: -100, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-4 bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 shadow-lg"
					>
						<div className="flex items-center gap-3 flex-1 min-w-0">
							<AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
							<div className="min-w-0 flex-1">
								<p className="text-white font-semibold text-sm">Error occurred</p>
								<p className="text-red-100 text-xs truncate">
									{props.error?.message || 'Unknown error'}
								</p>
							</div>
						</div>
						<Button
							onClick={toggleCollapsed}
							size="sm"
							variant="ghost"
							className="text-white hover:bg-red-600 flex-shrink-0"
						>
							Details
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
