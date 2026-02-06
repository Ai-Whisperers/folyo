'use client'

import {
  PlusIcon,
  MinusIcon,
  CodeBracketIcon,
  LinkIcon,
  StarIcon,
  CommandLineIcon,
  DocumentTextIcon,
  FolderIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface DeveloperProfileSectionProps {
  data: any
  updateField: (path: string, value: any) => void
  addArrayItem: (path: string, template: any) => void
  removeArrayItem: (path: string, index: number) => void
}

const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'Shell',
  'HTML', 'CSS', 'Sass', 'GraphQL', 'Solidity', 'Dart', 'Lua', 'Perl'
]

const FRAMEWORKS_TOOLS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django',
  'Flask', 'Spring Boot', 'Rails', 'Laravel', 'FastAPI', '.NET', 'Flutter',
  'React Native', 'Electron', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API', 'Git'
]

const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'api', label: 'API / Backend' },
  { value: 'library', label: 'Library / Package' },
  { value: 'cli', label: 'CLI Tool' },
  { value: 'game', label: 'Game' },
  { value: 'ml', label: 'ML / AI Project' },
  { value: 'blockchain', label: 'Blockchain / Web3' },
  { value: 'iot', label: 'IoT / Embedded' },
  { value: 'other', label: 'Other' }
]

export function DeveloperProfileSection({ data, updateField, addArrayItem, removeArrayItem }: DeveloperProfileSectionProps) {
  const [codeSnippetExpanded, setCodeSnippetExpanded] = useState<number | null>(null)

  const repositories = data.developerProfile?.repositories || []
  const codeSnippets = data.developerProfile?.codeSnippets || []

  const addRepository = () => {
    addArrayItem('developerProfile.repositories', {
      name: '',
      url: '',
      description: '',
      language: 'JavaScript',
      stars: '',
      forks: '',
      topics: [],
      type: 'web-app',
      featured: false,
      demoUrl: ''
    })
  }

  const addCodeSnippet = () => {
    addArrayItem('developerProfile.codeSnippets', {
      title: '',
      description: '',
      language: 'javascript',
      code: '',
      filename: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <CodeBracketIcon className="h-5 w-5 text-green-600" />
            Developer Profile
          </h3>
          <p className="text-sm text-gray-500">
            Showcase your code repositories, projects, and technical skills.
          </p>
        </div>
      </div>

      {/* GitHub Integration */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-3">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
          <div>
            <h4 className="font-semibold">GitHub Profile</h4>
            <p className="text-sm text-gray-300">Connect your GitHub to showcase your contributions</p>
          </div>
        </div>
        <input
          type="text"
          className="form-input bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          value={data.developerProfile?.githubUsername || data.sidebar?.github || ''}
          onChange={(e) => updateField('developerProfile.githubUsername', e.target.value)}
          placeholder="your-github-username"
        />
        <p className="text-xs text-gray-400 mt-2">
          Your GitHub contribution graph and pinned repos will be displayed on your portfolio.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <label className="form-label text-green-800 mb-3">Primary Tech Stack</label>

        <div className="mb-4">
          <label className="text-sm font-medium text-green-700 mb-2 block">Languages</label>
          <div className="flex flex-wrap gap-2">
            {PROGRAMMING_LANGUAGES.map(lang => {
              const isSelected = (data.developerProfile?.languages || []).includes(lang)
              return (
                <button
                  key={lang}
                  onClick={() => {
                    const current = data.developerProfile?.languages || []
                    const updated = isSelected
                      ? current.filter((l: string) => l !== lang)
                      : [...current, lang]
                    updateField('developerProfile.languages', updated)
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    isSelected
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-green-400'
                  }`}
                >
                  {lang}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-green-700 mb-2 block">Frameworks & Tools</label>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS_TOOLS.map(tool => {
              const isSelected = (data.developerProfile?.frameworks || []).includes(tool)
              return (
                <button
                  key={tool}
                  onClick={() => {
                    const current = data.developerProfile?.frameworks || []
                    const updated = isSelected
                      ? current.filter((t: string) => t !== tool)
                      : [...current, tool]
                    updateField('developerProfile.frameworks', updated)
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    isSelected
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-green-400'
                  }`}
                >
                  {tool}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Repositories Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FolderIcon className="h-5 w-5 text-gray-500" />
              Featured Repositories
            </h4>
            <p className="text-sm text-gray-500">Showcase your best projects</p>
          </div>
          <button onClick={addRepository} className="btn-secondary text-sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Repository
          </button>
        </div>

        {repositories.map((repo: any, index: number) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 p-2 rounded-lg">
                  <FolderIcon className="h-5 w-5 text-gray-600" />
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">Repository #{index + 1}</h4>
                  {repo.name && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      {repo.name}
                      {repo.featured && <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeArrayItem('developerProfile.repositories', index)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Repository Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={repo.name || ''}
                    onChange={(e) => updateField(`developerProfile.repositories.${index}.name`, e.target.value)}
                    placeholder="my-awesome-project"
                  />
                </div>

                <div>
                  <label className="form-label">GitHub URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    value={repo.url || ''}
                    onChange={(e) => updateField(`developerProfile.repositories.${index}.url`, e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Primary Language</label>
                    <select
                      className="form-input"
                      value={repo.language || 'JavaScript'}
                      onChange={(e) => updateField(`developerProfile.repositories.${index}.language`, e.target.value)}
                    >
                      {PROGRAMMING_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Project Type</label>
                    <select
                      className="form-input"
                      value={repo.type || 'web-app'}
                      onChange={(e) => updateField(`developerProfile.repositories.${index}.type`, e.target.value)}
                    >
                      {PROJECT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={repo.demoUrl || ''}
                    onChange={(e) => updateField(`developerProfile.repositories.${index}.demoUrl`, e.target.value)}
                    placeholder="https://my-project.vercel.app"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input h-24"
                    value={repo.description || ''}
                    onChange={(e) => updateField(`developerProfile.repositories.${index}.description`, e.target.value)}
                    placeholder="A brief description of what the project does and the technologies used..."
                  />
                </div>

                <div>
                  <label className="form-label">Topics / Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={Array.isArray(repo.topics) ? repo.topics.join(', ') : ''}
                    onChange={(e) => updateField(`developerProfile.repositories.${index}.topics`, e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                    placeholder="react, typescript, api"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Stars</label>
                    <input
                      type="text"
                      className="form-input"
                      value={repo.stars || ''}
                      onChange={(e) => updateField(`developerProfile.repositories.${index}.stars`, e.target.value)}
                      placeholder="125"
                    />
                  </div>
                  <div>
                    <label className="form-label">Forks</label>
                    <input
                      type="text"
                      className="form-input"
                      value={repo.forks || ''}
                      onChange={(e) => updateField(`developerProfile.repositories.${index}.forks`, e.target.value)}
                      placeholder="23"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700 flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      Featured Project
                    </label>
                    <p className="text-xs text-gray-500">Highlight this as a top project</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={repo.featured || false}
                      onChange={(e) => updateField(`developerProfile.repositories.${index}.featured`, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        {repositories.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FolderIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No repositories added yet</p>
            <button onClick={addRepository} className="btn-secondary text-sm mt-3">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Repository
            </button>
          </div>
        )}
      </div>

      {/* Code Snippets Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <CommandLineIcon className="h-5 w-5 text-gray-500" />
              Code Snippets
            </h4>
            <p className="text-sm text-gray-500">Share code samples that showcase your skills</p>
          </div>
          <button onClick={addCodeSnippet} className="btn-secondary text-sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Snippet
          </button>
        </div>

        {codeSnippets.map((snippet: any, index: number) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-900 p-2 rounded-lg">
                  <CodeBracketIcon className="h-5 w-5 text-green-400" />
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">Snippet #{index + 1}</h4>
                  {snippet.title && <p className="text-sm text-gray-500">{snippet.title}</p>}
                </div>
              </div>
              <button
                onClick={() => removeArrayItem('developerProfile.codeSnippets', index)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={snippet.title || ''}
                    onChange={(e) => updateField(`developerProfile.codeSnippets.${index}.title`, e.target.value)}
                    placeholder="Custom React Hook"
                  />
                </div>
                <div>
                  <label className="form-label">Language</label>
                  <select
                    className="form-input"
                    value={snippet.language || 'javascript'}
                    onChange={(e) => updateField(`developerProfile.codeSnippets.${index}.language`, e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="ruby">Ruby</option>
                    <option value="php">PHP</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="sql">SQL</option>
                    <option value="shell">Shell/Bash</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Filename (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={snippet.filename || ''}
                    onChange={(e) => updateField(`developerProfile.codeSnippets.${index}.filename`, e.target.value)}
                    placeholder="useCustomHook.ts"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={snippet.description || ''}
                  onChange={(e) => updateField(`developerProfile.codeSnippets.${index}.description`, e.target.value)}
                  placeholder="A brief explanation of what this code does"
                />
              </div>

              <div>
                <label className="form-label">Code</label>
                <textarea
                  className="form-input font-mono text-sm h-48 bg-gray-900 text-green-400"
                  value={snippet.code || ''}
                  onChange={(e) => updateField(`developerProfile.codeSnippets.${index}.code`, e.target.value)}
                  placeholder="// Paste your code here..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        ))}

        {codeSnippets.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <CommandLineIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No code snippets added yet</p>
            <button onClick={addCodeSnippet} className="btn-secondary text-sm mt-3">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Code Snippet
            </button>
          </div>
        )}
      </div>

      {/* Additional Links */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="form-label mb-3">Additional Developer Links</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Stack Overflow</label>
            <input
              type="url"
              className="form-input"
              value={data.developerProfile?.stackOverflow || ''}
              onChange={(e) => updateField('developerProfile.stackOverflow', e.target.value)}
              placeholder="https://stackoverflow.com/users/..."
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Dev.to / Blog</label>
            <input
              type="url"
              className="form-input"
              value={data.developerProfile?.devBlog || ''}
              onChange={(e) => updateField('developerProfile.devBlog', e.target.value)}
              placeholder="https://dev.to/username"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">CodePen</label>
            <input
              type="url"
              className="form-input"
              value={data.developerProfile?.codepen || ''}
              onChange={(e) => updateField('developerProfile.codepen', e.target.value)}
              placeholder="https://codepen.io/username"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">npm / PyPI</label>
            <input
              type="url"
              className="form-input"
              value={data.developerProfile?.packageRegistry || ''}
              onChange={(e) => updateField('developerProfile.packageRegistry', e.target.value)}
              placeholder="https://www.npmjs.com/~username"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
